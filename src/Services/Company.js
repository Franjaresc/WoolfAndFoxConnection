'use server';
import { sql } from "@vercel/postgres";
import { z } from "zod";

// --- Custom Error Classes ---
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
    }
}

// --- Validation Schema ---
const companySchema = z.object({
    Id: z.number().int().positive().or(z.string()).refine(val => typeof val === 'number' || /^\d+$/.test(val), {
        message: "Company ID must be a positive integer."
    }),
    Name: z.string().min(1, { message: "Company name cannot be empty." })
});

// --- Utility Functions ---

/**
 * Formatea los datos de una compañía.
 * @param {Object} company - Datos de la compañía.
 * @returns {Object} Datos formateados de la compañía.
 */
const formatCompanyData = (company) => ({
    Id: company.Id,
    Name: company.Name
});

/**
 * Maneja y registra los errores de la base de datos.
 * @param {Error} error - Error capturado.
 * @param {string} action - Acción que se estaba realizando cuando ocurrió el error.
 * @throws {DatabaseError} Error personalizado de la base de datos.
 */
const handleDatabaseError = (error, action) => {
    console.error(`Error ${action} company:`, error);
    throw new DatabaseError(`Error ${action} company: ${error.message}`);
};

/**
 * Valida los datos de una compañía utilizando Zod.
 * @param {Object} data - Datos de la compañía a validar.
 * @throws {ValidationError} Si los datos no pasan la validación.
 */
const validateCompanyData = (data) => {
    try {
        return companySchema.parse(data);
    } catch (error) {
        throw new ValidationError(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
    }
};

// --- CRUD Functions ---

/**
 * Obtiene todas las compañías de la base de datos.
 * @returns {Promise<Array>} Lista de compañías.
 * @throws {DatabaseError} Si ocurre un error al obtener las compañías.
 */
export const fetchCompanies = async () => {
    try {
        const { rows } = await sql`
            SELECT "Id", "Name" 
            FROM "Company" 
            ORDER BY "Id" ASC;
        `;
        return rows.map(formatCompanyData);
    } catch (error) {
        handleDatabaseError(error, "fetching");
    }
};

/**
 * Inserta una nueva compañía en la base de datos.
 * @param {Object} companyData - Datos de la compañía a insertar.
 * @param {number} companyData.Id - ID de la compañía.
 * @param {string} companyData.Name - Nombre de la compañía.
 * @returns {Promise<Object>} Datos de la compañía insertada.
 * @throws {ValidationError} Si los datos no pasan la validación.
 * @throws {DatabaseError} Si ocurre un error al insertar la compañía.
 */
export const insertCompany = async ({ Id, Name }) => {
    try {
        validateCompanyData({ Id, Name });

        const { rows, rowCount } = await sql`
            INSERT INTO "Company" ("Id", "Name")
            VALUES (${Id}, ${Name}) 
            ON CONFLICT ("Id") DO NOTHING
            RETURNING "Id", "Name";
        `;

        if (rowCount === 0) {
            throw new DatabaseError("Insertion failed: A company with this ID may already exist.");
        }

        return formatCompanyData(rows[0]);
    } catch (error) {
        if (error instanceof ValidationError) {
            throw error;
        }
        handleDatabaseError(error, "inserting");
    }
};

/**
 * Actualiza una compañía existente en la base de datos.
 * @param {Object} companyData - Datos de la compañía a actualizar.
 * @param {number} companyData.Id - ID de la compañía.
 * @param {string} companyData.Name - Nuevo nombre de la compañía.
 * @returns {Promise<Object>} Datos de la compañía actualizada.
 * @throws {ValidationError} Si los datos no pasan la validación.
 * @throws {NotFoundError} Si no se encuentra la compañía a actualizar.
 * @throws {DatabaseError} Si ocurre un error al actualizar la compañía.
 */
export const updateCompany = async ({ Id, Name }) => {
    try {
        validateCompanyData({ Id, Name });

        const { rows, rowCount } = await sql`
            UPDATE "Company" 
            SET "Name" = ${Name}
            WHERE "Id" = ${Id}
            RETURNING "Id", "Name";
        `;

        if (rowCount === 0) {
            throw new NotFoundError(`No company found with Id: ${Id}`);
        }

        return formatCompanyData(rows[0]);
    } catch (error) {
        if (error instanceof ValidationError || error instanceof NotFoundError) {
            throw error;
        }
        handleDatabaseError(error, "updating");
    }
};

/**
 * Elimina una compañía de la base de datos.
 * @param {number} Id - ID de la compañía a eliminar.
 * @returns {Promise<number>} ID de la compañía eliminada.
 * @throws {ValidationError} Si el ID no es válido.
 * @throws {NotFoundError} Si no se encuentra la compañía a eliminar.
 * @throws {DatabaseError} Si ocurre un error al eliminar la compañía.
 */
export const deleteCompany = async (Id) => {
    try {
        // Validación básica del ID
        const schema = z.number().int().positive();

        schema.parse(Id); // Validación del ID

        const { rows, rowCount } = await sql`
            DELETE FROM "Company" 
            WHERE "Id" = ${Id} 
            RETURNING "Id";
        `;

        if (rowCount === 0) {
            throw new NotFoundError(`No company found with Id: ${Id}`);
        }

        return rows[0].Id;
    } catch (error) {
        if (error instanceof ValidationError || error instanceof NotFoundError) {
            throw error;
        }
        handleDatabaseError(error, "deleting");
    }
};
