'use server';
import { orderTypeSchema } from '@/schemas/orderSchema';
import { db } from '@vercel/postgres';
import { z } from 'zod';



// --- Utility Functions ---

/**
 * Formatea los datos de un tipo de orden.
 * @param {Object} type - Datos del tipo de orden.
 * @returns {Object} Datos formateados del tipo de orden.
 */
const formatOrderTypeData = (type) => ({
    Id: type.Id,
    Name: type.Name
});

/**
 * Maneja y registra los errores de la base de datos.
 * @param {Error} error - Error capturado.
 * @param {string} action - Acción que se estaba realizando cuando ocurrió el error.
 */
const handleDatabaseError = (error, action) => {
    console.error(`Error ${action} order type:`, error);
    throw new Error(`Error ${action} order type: ${error.message}`);
};

// --- CRUD Functions ---

/**
 * Obtiene todos los tipos de órdenes de la base de datos.
 * @returns {Promise<Array>} Lista de tipos de órdenes.
 * @throws {DatabaseError} Si ocurre un error al obtener los tipos de órdenes.
 */
export const fetchOrderTypes = async () => {
    let client;
    try {
        client = await db.connect();
        const { rows } = await client.query(`
            SELECT "Id", "Name"
            FROM "Order_Types"
            ORDER BY "Id" ASC;
        `);
        return rows.map(formatOrderTypeData);
    } catch (error) {
        handleDatabaseError(error, "fetching");
    } finally {
        client?.release();
    }
};

/**
 * Inserta un nuevo tipo de orden en la base de datos.
 * @param {Object} orderTypeData - Datos del tipo de orden a insertar.
 * @returns {Promise<Object>} Tipo de orden insertado.
 * @throws {ValidationError} Si los datos del tipo de orden no son válidos.
 * @throws {DatabaseError} Si ocurre un error al insertar el tipo de orden.
 */
export const insertOrderType = async (orderTypeData) => {
    let client;
    try {
        orderTypeSchema.parse(orderTypeData);

        client = await db.connect();
        const { rows, rowCount } = await client.query(`
            INSERT INTO "Order_Types" ("Id", "Name")
            VALUES ($1, $2)
            ON CONFLICT ("Id") DO NOTHING
            RETURNING "Id", "Name";
        `, [orderTypeData.Id, orderTypeData.Name]);

        if (rowCount === 0) throw new Error("Insertion failed: order type with this ID may already exist.");
        return formatOrderTypeData(rows[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
        } else {
            handleDatabaseError(error, "inserting");
        }
    } finally {
        client?.release();
    }
};

/**
 * Actualiza un tipo de orden existente en la base de datos.
 * @param {Object} orderTypeData - Datos del tipo de orden a actualizar.
 * @returns {Promise<Object>} Tipo de orden actualizado.
 * @throws {ValidationError} Si los datos del tipo de orden no son válidos.
 * @throws {DatabaseError} Si ocurre un error al actualizar el tipo de orden.
 */
export const updateOrderType = async (orderTypeData) => {
    let client;
    try {
        orderTypeSchema.parse(orderTypeData);

        client = await db.connect();
        const { rows, rowCount } = await client.query(`
            UPDATE "Order_Types"
            SET "Name" = $1
            WHERE "Id" = $2
            RETURNING "Id", "Name";
        `, [orderTypeData.Name, orderTypeData.Id]);

        if (rowCount === 0) throw new Error(`No order type found with Id: ${orderTypeData.Id}`);
        return formatOrderTypeData(rows[0]);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
        } else {
            handleDatabaseError(error, "updating");
        }
    } finally {
        client?.release();
    }
};

/**
 * Elimina un tipo de orden de la base de datos.
 * @param {bigint} Id - ID del tipo de orden a eliminar.
 * @returns {Promise<bigint>} ID del tipo de orden eliminado.
 * @throws {ValidationError} Si el ID del tipo de orden no es válido.
 * @throws {DatabaseError} Si ocurre un error al eliminar el tipo de orden.
 */
export const deleteOrderType = async (Id) => {
    let client;
    try {
        if (typeof Id !== 'bigint' || Id <= 0) {
            throw new Error("Invalid order type ID: must be a positive number for deletion.");
        }

        client = await db.connect();
        const { rows, rowCount } = await client.query(`
            DELETE FROM "Order_Types"
            WHERE "Id" = $1
            RETURNING "Id";
        `, [Id]);

        if (rowCount === 0) throw new Error(`No order type found with Id: ${Id}`);
        return rows[0].Id;
    } catch (error) {
        handleDatabaseError(error, "deleting");
    } finally {
        client?.release();
    }
};