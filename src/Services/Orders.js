'use server';
import { sql } from "@vercel/postgres";

// Función para obtener órdenes desde la base de datos
export const fetchOrders = async () => {
    try {
        const response = await sql`
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
            ORDER BY "Date" ASC
        `;

        const data = response.rows.map(order => ({
            Date: new Date(order.Date).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            }),
            Id: order.Id,
            Type: order.Type,
            Company: order.Company,
            Price: order.Price,
            Observation: order.Observation
        }));

        return data;

    } catch (error) {
        throw new Error(`Error fetching orders: ${error.message}`);
    }
};

// Función para validar datos de órdenes
const validateOrderData = ({ Id, Date, Type, Company, Price, Observation }) => {
    if (!Id || typeof Id !== 'string') {
        throw new Error("Invalid order ID. Ensure the ID is provided and is a string.");
    }
    if (!Date || !Type || !Company || !Price) {
        throw new Error("Invalid order data. Ensure all fields are filled correctly." + Date + "aaaaaa" + Type + "aaaaaaa" + Company + "aaaaaa" + Price);
    }
};

// Función para insertar una nueva orden
export const insertOrder = async (orderData) => {
    try {
        validateOrderData(orderData); // Validar los datos de la orden

        const insert = await sql`
            INSERT INTO "Orders" ("Id", "Date", "Type", "Company", "Price", "Observation")
            VALUES (${orderData.Id}, ${orderData.Date}, ${orderData.Type}, ${orderData.Company}, ${orderData.Price}, ${orderData.Observation});`;

        const response = await sql`
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
            WHERE o."Id" = ${orderData.Id}
            ORDER BY "Date" ASC
            
        `;
        const data = response.rows.map(order => ({
            Date: new Date(order.Date).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            }),
            Id: order.Id,
            Type: order.Type,
            Company: order.Company,
            Price: order.Price,
            Observation: order.Observation
        }));
        return data[0]; // Devuelve el ID de la nueva orden

    } catch (error) {
        throw new Error(`Error inserting order: ${error.message}`);
    }
};

// Función para actualizar una orden existente
export const updateOrder = async (orderData) => {
    try {
        validateOrderData(orderData); // Validar los datos de la orden

        const response = await sql`
            UPDATE public."Orders" 
            SET 
                "Date" = ${orderData.Date}, 
                "Type" = ${orderData.Type}, 
                "Company" = ${orderData.Company}, 
                "Price" = ${orderData.Price}, 
                "Observation" = ${orderData.Observation}
            WHERE "Id" = ${orderData.Id};`;

        if (response.rowCount === 0) {
            throw new Error(`No order found with Id: ${orderData.Id}`);
        }

        return orderData.Id; // Devuelve el ID de la orden actualizada

    } catch (error) {
        throw new Error(`Error updating order: ${error.message}`);
    }
};

// Función para eliminar una orden
export const deleteOrder = async (Id) => {
    try {
        if (!Id) {
            throw new Error("Order ID is required for deletion.");
        }

        const response = await sql`
            DELETE FROM public."Orders" 
            WHERE "Id" = ${Id} RETURNING "Id";`;

        if (response.rowCount === 0) {
            throw new Error(`No order found with Id: ${Id}`);
        }

        return Id; // Devuelve el ID de la orden eliminada

    } catch (error) {
        throw new Error(`Error deleting order: ${error.message}`);
    }
};
