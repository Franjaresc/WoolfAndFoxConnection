'use server';
import { sql } from "@vercel/postgres";

// --- Utility Functions ---
// Format and validate order data consistently across functions
const formatOrderData = (order) => ({
    Id: order.Id,
    Date: new Date(order.Date).toLocaleDateString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric' }),
    Type: order.Type,
    Company: order.Company,
    Price: order.Price,
    Observation: order.Observation || null
});

const validateOrderData = ({ Id, Date, Type, Company, Price, Observation }) => {
    if (!Id || typeof Id !== 'string') throw new Error("Invalid order ID. Ensure the ID is a non-empty string.");
    if (!Date) throw new Error("Invalid date. Ensure the date is provided.");
    if (typeof Type !== 'number' || Type <= 0) throw new Error("Invalid order type. Ensure the type is a positive number.");
    if (typeof Company !== 'number' || Company <= 0) throw new Error("Invalid company ID. Ensure the company is a positive number.");
    if (typeof Price !== 'number' || Price < 0) throw new Error("Invalid price. Ensure the price is a non-negative number.");
    if (Observation && typeof Observation !== 'string') throw new Error("Invalid observation. Ensure it is a string.");
};

// Centralized error handling utility
const handleDatabaseError = (error, action) => {
    console.error(`Error ${action} order:`, error);
    throw new Error(`Error ${action} order: ${error.message}`);
};

// --- CRUD Functions ---
// Fetch all orders with related type and company names
export const fetchOrders = async () => {
    try {
        const { rows } = await sql`
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
        `;
        return rows.map(formatOrderData);
    } catch (error) {
        handleDatabaseError(error, "fetching");
    }
};

// Insert a new order
export const insertOrder = async (orderData) => {
    try {
        validateOrderData(orderData);

        const { rowCount } = await sql`
            INSERT INTO "Orders" ("Id", "Date", "Type", "Company", "Price", "Observation")
            VALUES (${orderData.Id}, ${orderData.Date}, ${orderData.Type}, ${orderData.Company}, ${orderData.Price}, ${orderData.Observation})
            ON CONFLICT ("Id") DO NOTHING;
        `;

        if (rowCount === 0) throw new Error("Insertion failed: order with this ID may already exist.");
        return await fetchOrderById(orderData.Id);

    } catch (error) {
        handleDatabaseError(error, "inserting");
    }
};

// Update an existing order
export const updateOrder = async (orderData) => {
    try {
        validateOrderData(orderData);

        const { rowCount } = await sql`
            UPDATE "Orders" 
            SET 
                "Date" = ${orderData.Date}, 
                "Type" = ${orderData.Type}, 
                "Company" = ${orderData.Company}, 
                "Price" = ${orderData.Price}, 
                "Observation" = ${orderData.Observation}
            WHERE "Id" = ${orderData.Id};
        `;

        if (rowCount === 0) throw new Error(`No order found with Id: ${orderData.Id}`);
        return await fetchOrderById(orderData.Id);

    } catch (error) {
        handleDatabaseError(error, "updating");
    }
};

// Delete an order
export const deleteOrder = async (Id) => {
    try {
        if (!Id || typeof Id !== 'string') throw new Error("Order ID is required for deletion.");

        const { rowCount } = await sql`
            DELETE FROM "Orders" 
            WHERE "Id" = ${Id} 
            RETURNING "Id";
        `;

        if (rowCount === 0) throw new Error(`No order found with Id: ${Id}`);
        return Id;

    } catch (error) {
        handleDatabaseError(error, "deleting");
    }
};

// Fetch a specific order by Id
const fetchOrderById = async (Id) => {
    const { rows } = await sql`
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
        WHERE o."Id" = ${Id};
    `;

    const order = rows[0];
    return order ? formatOrderData(order) : null;
};
