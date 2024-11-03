'use server';
import { sql } from "@vercel/postgres";

// Función para obtener las compañías desde la base de datos
export const fetchCompany = async () => {
    try {
        const response = await sql`SELECT * FROM "Company" ORDER BY "Id" ASC`;
        const data = response.rows.map(company => ({
            Id: company.Id,
            Name: company.Name,
        }));

        return  data;

    } catch (error) {
        throw new Error(`Error fetching companies: ${error.message}`);
    }
};

// Función para validar los datos de la compañía
const validateCompanyData = ({ Id, Name }) => {
    if (!Id || typeof Id !== 'number') {
        throw new Error("Invalid company ID. Ensure the ID is provided and is a number.");
    }
    if (!Name || typeof Name !== 'string') {
        throw new Error("Invalid company data. Ensure the name is provided and is a string.");
    }
};

// Función para insertar una nueva compañía
export const insertCompany = async ({ Id, Name }) => {
    try {
        validateCompanyData({ Id, Name }); // Validar los datos de la compañía

        const response = await sql`
            INSERT INTO public."Company" ("Id", "Name")
            VALUES (${Id}, ${Name}) 
            ON CONFLICT ("Id") DO NOTHING
            RETURNING *;`;

        if (response.rowCount === 0) {
            throw new Error(`Company with Id ${Id} already exists.`);
        }

        return response.rows[0].Id; // Devuelve el ID de la nueva compañía

    } catch (error) {
        throw new Error(`Error inserting company: ${error.message}`);
    }
};

// Función para actualizar una compañía existente
export const updateCompany = async ({ Id, Name }) => {
    try {
        validateCompanyData({ Id, Name }); // Validar los datos de la compañía

        const response = await sql`
            UPDATE public."Company" 
            SET "Name" = ${Name}
            WHERE "Id" = ${Id};`;

        if (response.rowCount === 0) {
            throw new Error(`No company found with Id: ${Id}`);
        }

        return Id; // Devuelve el ID de la compañía actualizada

    } catch (error) {
        throw new Error(`Error updating company: ${error.message}`);
    }
};

// Función para eliminar una compañía
export const deleteCompany = async (Id) => {
    try {
        if (!Id) {
            throw new Error("Company ID is required for deletion.");
        }

        const response = await sql`
            DELETE FROM public."Company" 
            WHERE "Id" = ${Id};`;

        if (response.rowCount === 0) {
            throw new Error(`No company found with Id: ${Id}`);
        }

        return Id; // Devuelve el ID de la compañía eliminada

    } catch (error) {
        throw new Error(`Error deleting company: ${error.message}`);
    }
};
