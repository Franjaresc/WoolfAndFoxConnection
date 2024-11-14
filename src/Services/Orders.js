'use server';
import { db } from '@vercel/postgres';
import { z } from 'zod';
import { fetchOrderTypes } from "./OrderTypes";
import { orderSchema } from '@/schemas/orderSchema';
import { createObjectCsvStringifier } from 'csv-writer';

// --- Utility Functions ---

/**
 * Formatea los datos de una orden.
 * @param {Object} order - Datos de la orden.
 * @returns {Object} Datos formateados de la orden.
 */
const formatOrderData = (order) => {
    const formattedOrder = {
        Id: order.Id,
        Date: new Date(order.Date).toLocaleDateString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric' }),
        Type: order.Type,
        Company: order.Company,
        Price: order.Price,
        Observation: order.Observation || null
    };

    // Incluir los conteos por tipo de orden
    Object.keys(order).forEach(key => {
        if (!formattedOrder.hasOwnProperty(key) && key !== 'Id' && key !== 'Date' && key !== 'Type' && key !== 'Company' && key !== 'Price' && key !== 'Observation') {
            formattedOrder[key] = order[key];
        }
    });

    return formattedOrder;
};


/**
 * Maneja y registra los errores de la base de datos.
 * @param {Error} error - Error capturado.
 * @param {string} action - Acción que se estaba realizando cuando ocurrió el error.
 */
const handleDatabaseError = (error, action) => {
    console.error(`Error ${action} order:`, error);
    throw new Error(`Error ${action} order: ${error.message}`);
};

// --- CRUD Functions ---

/**
 * Obtiene todas las órdenes con los nombres de tipo y compañía relacionados.
 * @returns {Promise<Array>} Lista de órdenes.
 * @throws {DatabaseError} Si ocurre un error al obtener las órdenes.
 */
export const fetchOrders = async () => {
    try {
        const client = await db.connect();
        const { rows } = await client.query(`
            SELECT 
                o."Date", 
                o."Id", 
                ot."Name" AS "Type", 
                c."Name" AS "Company", 
                o."Price", 
                o."Observation" 
            FROM "Orders" o 
            INNER JOIN "Order_Types" ot ON o."Type" = ot."Id" 
            INNER JOIN "Company" c ON o."Company" = c."Id" 
            ORDER BY o."Date" ASC;
        `);
        client.release();
        return rows.map(formatOrderData);
    } catch (error) {
        handleDatabaseError(error, "fetching");
    }
};

/**
 * Inserta una nueva orden en la base de datos.
 * @param {Object} orderData - Datos de la orden a insertar.
 * @returns {Promise<Object>} Orden insertada.
 * @throws {ValidationError} Si los datos de la orden no son válidos.
 * @throws {DatabaseError} Si ocurre un error al insertar la orden.
 */
export const insertOrder = async (orderData) => {
    try {
        orderSchema.parse(orderData);

        const client = await db.connect();
        const { rowCount } = await client.query(`
            INSERT INTO "Orders" ("Id", "Date", "Type", "Company", "Price", "Observation")
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT ("Id") DO NOTHING;
        `, [orderData.Id, orderData.Date, orderData.Type, orderData.Company, orderData.Price, orderData.Observation]);
        client.release();

        if (rowCount === 0) throw new Error("Insertion failed: order with this ID may already exist.");
        return await fetchOrderById(orderData.Id);

    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
        } else {
            handleDatabaseError(error, "inserting");
        }
    }
};

/**
 * Actualiza una orden existente en la base de datos.
 * @param {Object} orderData - Datos de la orden a actualizar.
 * @returns {Promise<Object>} Orden actualizada.
 * @throws {ValidationError} Si los datos de la orden no son válidos.
 * @throws {DatabaseError} Si ocurre un error al actualizar la orden.
 */
export const updateOrder = async (orderData) => {
    try {
        orderSchema.parse(orderData);

        const client = await db.connect();
        const { rowCount } = await client.query(`
            UPDATE "Orders" 
            SET 
                "Date" = $1, 
                "Type" = $2, 
                "Company" = $3, 
                "Price" = $4, 
                "Observation" = $5
            WHERE "Id" = $6;
        `, [orderData.Date, orderData.Type, orderData.Company, orderData.Price, orderData.Observation, orderData.Id]);
        client.release();

        if (rowCount === 0) throw new Error(`No order found with Id: ${orderData.Id}`);
        return await fetchOrderById(orderData.Id);

    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
        } else {
            handleDatabaseError(error, "updating");
        }
    }
};

/**
 * Elimina una orden de la base de datos.
 * @param {string} Id - ID de la orden a eliminar.
 * @returns {Promise<string>} ID de la orden eliminada.
 * @throws {ValidationError} Si el ID de la orden no es válido.
 * @throws {DatabaseError} Si ocurre un error al eliminar la orden.
 */
export const deleteOrder = async (Id) => {
    try {
        if (!Id || typeof Id !== 'string') throw new Error("Order ID is required for deletion.");

        const client = await db.connect();
        const { rowCount } = await client.query(`
            DELETE FROM "Orders" 
            WHERE "Id" = $1 
            RETURNING "Id";
        `, [Id]);
        client.release();

        if (rowCount === 0) throw new Error(`No order found with Id: ${Id}`);
        return Id;

    } catch (error) {
        handleDatabaseError(error, "deleting");
    }
};

/**
 * Obtiene una orden específica por su ID.
 * @param {string} Id - ID de la orden a obtener.
 * @returns {Promise<Object|null>} Orden obtenida o null si no se encuentra.
 * @throws {DatabaseError} Si ocurre un error al obtener la orden.
 */
const fetchOrderById = async (Id) => {
    try {
        const client = await db.connect();
        const { rows } = await client.query(`
            SELECT 
                o."Date", 
                o."Id", 
                ot."Name" AS "Type", 
                c."Name" AS "Company", 
                o."Price", 
                o."Observation" 
            FROM "Orders" o 
            INNER JOIN "Order_Types" ot ON o."Type" = ot."Id" 
            INNER JOIN "Company" c ON o."Company" = c."Id" 
            WHERE o."Id" = $1;
        `, [Id]);
        client.release();

        const order = rows[0];
        return order ? formatOrderData(order) : null;
    }
    catch (error) {
        handleDatabaseError(error, "fetching");
    }
};

/**
 * Obtiene el conteo de órdenes por mes dentro de un rango de fechas.
 * @param {number} company - Id de la empresa.
 * @param {string} startDate - Fecha de inicio.
 * @param {string} endDate - Fecha de fin.
 * @returns {Promise<Array>} Conteo de órdenes por mes, separadas por tipo de orden 
 * @throws {DatabaseError} Si ocurre un error al obtener el conteo de órdenes.
 */
export const fetchOrderCountsByMonth = async ({ company, startDate, endDate }) => {
    const values = [startDate, endDate];

    try {
        // Paso 1: Obtener los tipos de órdenes
        const orderTypes = await fetchOrderTypes();

        // Paso 2: Construir dinámicamente los casos de conteo para cada tipo
        const caseStatements = orderTypes.map((type, index) => {
            return `SUM(CASE WHEN ot."Name" = $${index + 3} THEN 1 ELSE 0 END) AS "${type.Name.toLowerCase()}"`;
        }).join(", ");

        // Agregar los nombres de los tipos de órdenes a los valores
        const typeNames = orderTypes.map(type => type.Name);
        const allValues = values.concat(typeNames);

        // Paso 3: Construir la consulta SQL completa
        const query = `
            WITH date_filtered_orders AS (
                SELECT
                    o.*,
                    TO_CHAR(o."Date", 'YYYY/MM') AS "DateFormatted"
                FROM
                    public."Orders" o
                WHERE
                    o."Date" BETWEEN $1 AND $2
                    ${company ? 'AND o."Company" = $3' : ''}
            )
            SELECT
                "DateFormatted" AS "Date",
                ${caseStatements}  -- Inserta los casos generados dinámicamente
            FROM
                date_filtered_orders o
            JOIN
                public."Order_Types" ot ON o."Type" = ot."Id"
            GROUP BY
                "DateFormatted"
            ORDER BY
                "DateFormatted";
        `;

        // Si se proporciona una compañía, agregarla a los valores
        if (company) {
            allValues.splice(2, 0, company);
        }

        // Paso 4: Ejecutar la consulta
        const client = await db.connect();
        const { rows } = await client.query(query, allValues);
        client.release();

        return rows;
    } catch (error) {
        handleDatabaseError(error, "fetching dynamic order counts");
    }
};

/**
 * Obtiene las órdenes por rango de fechas y empresa.
 * @param {bigint} company - Id de la empresa.
 * @param {string} startDate - Fecha de inicio.
 * @param {string} endDate - Fecha de fin.
 * @returns {Promise<Array>} Lista de órdenes.
 * @throws {DatabaseError} Si ocurre un error al obtener las órdenes.
 */
export const fetchOrdersByDateRangeAndCompany = async (company, startDate, endDate) => {
    const values = [company, startDate, endDate];

    try {
        // Paso 1: Construir la consulta SQL completa
        const query = `
            SELECT o."Id", o."Date", ot."Name" AS "Type", c."Name" AS "Company", o."Price", o."Observation"
            FROM "Orders" o
            INNER JOIN "Order_Types" ot ON o."Type" = ot."Id"
            INNER JOIN "Company" c ON o."Company" = c."Id"
            WHERE o."Company" = $1 AND o."Date" BETWEEN $2 AND $3
            ORDER BY o."Date" ASC;
        `;

        const connection = await db.connect();
        const result = await connection.query(query, values);

        connection.release();
        return result.rows.map(formatOrderData);
    } catch (error) {
        throw new Error('DatabaseError: Error al obtener las órdenes' + error.message);
    }
};

/**
* Genera un archivo CSV con las órdenes.
* @param {Array} orders - Lista de órdenes.
*/
export const generateCSV = async (orders) => {
    // Calcular el total del precio de las órdenes
    const total = orders.reduce((sum, order) => sum + order.Price, 0);

    // Obtener los encabezados dinámicamente
    const headers = Object.keys(orders[0]).map(key => ({ id: key, title: key.charAt(0).toUpperCase() + key.slice(1) }));

    const csvStringifier = createObjectCsvStringifier({
        header: headers
    });

    const csvContent = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(orders) + `\nTotal,,,${total}\n`;

    return csvContent;
};

