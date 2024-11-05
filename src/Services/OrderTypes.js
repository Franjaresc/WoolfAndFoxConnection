'use server';
import { sql } from "@vercel/postgres";

// --- Utility Functions ---
// Format and validate order type data consistently across functions
const formatOrderTypeData = (type) => ({
    Id: type.Id,
    Name: type.Name
});

const validateOrderTypeData = ({ Id, Name }) => {
    if (typeof Id !== 'number' || Id <= 0) {
        throw new Error("Invalid order type ID: must be a positive number.");
    }
    if (typeof Name !== 'string' || Name.trim() === '') {
        throw new Error("Invalid order type name: must be a non-empty string.");
    }
};

// --- CRUD Functions ---
// Fetch all order types
export const fetchOrderTypes = async () => {
    try {
        const { rows } = await sql`
            SELECT "Id", "Name"
            FROM "Order_Types"
            ORDER BY "Id" ASC;
        `;
        return rows.map(formatOrderTypeData);
    } catch (error) {
        console.error("Error fetching order types:", error);
        throw new Error("Error fetching order types.");
    }
};

// Insert a new order type
export const insertOrderType = async ({ Id, Name }) => {
    try {
        validateOrderTypeData({ Id, Name });

        const { rows, rowCount } = await sql`
            INSERT INTO "Order_Types" ("Id", "Name")
            VALUES (${Id}, ${Name})
            ON CONFLICT ("Id") DO NOTHING
            RETURNING "Id", "Name";
        `;

        if (rowCount === 0) throw new Error("Insertion failed: order type with this ID may already exist.");
        return formatOrderTypeData(rows[0]);
    } catch (error) {
        console.error("Error inserting order type:", error);
        throw new Error("Error inserting order type.");
    }
};

// Update an existing order type
export const updateOrderType = async ({ Id, Name }) => {
    try {
        validateOrderTypeData({ Id, Name });

        const { rows, rowCount } = await sql`
            UPDATE "Order_Types"
            SET "Name" = ${Name}
            WHERE "Id" = ${Id}
            RETURNING "Id", "Name";
        `;

        if (rowCount === 0) throw new Error(`No order type found with Id: ${Id}`);
        return formatOrderTypeData(rows[0]);
    } catch (error) {
        console.error("Error updating order type:", error);
        throw new Error("Error updating order type.");
    }
};

// Delete an order type
export const deleteOrderType = async (Id) => {
    try {
        if (typeof Id !== 'number' || Id <= 0) {
            throw new Error("Invalid order type ID: must be a positive number for deletion.");
        }

        const { rows, rowCount } = await sql`
            DELETE FROM "Order_Types"
            WHERE "Id" = ${Id} 
            RETURNING "Id";
        `;

        if (rowCount === 0) throw new Error(`No order type found with Id: ${Id}`);
        return rows[0].Id;
    } catch (error) {
        console.error("Error deleting order type:", error);
        throw new Error("Error deleting order type.");
    }
};
