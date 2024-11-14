'use server';
import { companySchema } from '@/schemas/companySchema';
import { db } from '@vercel/postgres';
import { z } from 'zod';



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
 */
const handleDatabaseError = (error, action) => {
    console.error(`Error ${action} company:`, error);
    throw new Error(`Error ${action} company: ${error.message}`);
};

/**
 * Lanza un error de validación.
 * @param {Error} error - Error de validación capturado.
 * @throws {ValidationError} Error de validación con mensajes detallados.
 */
const handleValidationError = (error) => {
    throw new ValidationError(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
};

// --- CRUD Functions ---

/**
 * Obtiene todas las compañías de la base de datos.
 * @returns {Promise<Array>} Lista de compañías.
 * @throws {DatabaseError} Si ocurre un error al obtener las compañías.
 */
export const fetchCompanies = async () => {
    try {
        const client = await db.connect();
        const { rows } = await client.query(`
            SELECT "Id", "Name" 
            FROM "Company" 
            ORDER BY "Id" ASC;
        `);
        client.release();
        return rows.map(formatCompanyData);
    } catch (error) {
        handleDatabaseError(error, "fetching");
    }
};

/**
 * Inserta una nueva compañía en la base de datos.
 * @param {Object} companyData - Datos de la compañía a insertar.
 * @returns {Promise<Object>} Compañía insertada.
 * @throws {ValidationError} Si los datos de la compañía no son válidos.
 * @throws {DatabaseError} Si ocurre un error al insertar la compañía.
 */
export const insertCompany = async (companyData) => {
    try {
        companySchema.parse(companyData);

        const client = await db.connect();
        const { rowCount } = await client.query(`
            INSERT INTO "Company" ("Id", "Name")
            VALUES ($1, $2)
            ON CONFLICT ("Id") DO NOTHING;
        `, [companyData.Id, companyData.Name]);
        client.release();

        if (rowCount === 0) throw new Error("Insertion failed: company with this ID may already exist.");
        return await fetchCompanyById(companyData.Id);

    } catch (error) {
        if (error instanceof z.ZodError) {
            handleValidationError(error);
        } else {
            handleDatabaseError(error, "inserting");
        }
    }
};

/**
 * Actualiza una compañía existente en la base de datos.
 * @param {Object} companyData - Datos de la compañía a actualizar.
 * @returns {Promise<Object>} Compañía actualizada.
 * @throws {ValidationError} Si los datos de la compañía no son válidos.
 * @throws {DatabaseError} Si ocurre un error al actualizar la compañía.
 */
export const updateCompany = async (companyData) => {
    try {
        companySchema.parse(companyData);

        const client = await db.connect();
        const { rowCount } = await client.query(`
            UPDATE "Company"
            SET "Name" = $1
            WHERE "Id" = $2;
        `, [companyData.Name, companyData.Id]);
        client.release();

        if (rowCount === 0) throw new Error(`No company found with Id: ${companyData.Id}`);
        return await fetchCompanyById(companyData.Id);

    } catch (error) {
        if (error instanceof z.ZodError) {
            handleValidationError(error);
        } else {
            handleDatabaseError(error, "updating");
        }
    }
};

/**
 * Elimina una compañía de la base de datos.
 * @param {number|string} Id - ID de la compañía a eliminar.
 * @returns {Promise<number|string>} ID de la compañía eliminada.
 * @throws {ValidationError} Si el ID de la compañía no es válido.
 * @throws {DatabaseError} Si ocurre un error al eliminar la compañía.
 */
export const deleteCompany = async (Id) => {
    try {
        if (!Id || (typeof Id !== 'number' && typeof Id !== 'string')) throw new Error("Company ID is required for deletion.");

        const client = await db.connect();
        const { rowCount } = await client.query(`
            DELETE FROM "Company"
            WHERE "Id" = $1
            RETURNING "Id";
        `, [Id]);
        client.release();

        if (rowCount === 0) throw new Error(`No company found with Id: ${Id}`);
        return Id;

    } catch (error) {
        handleDatabaseError(error, "deleting");
    }
};

/**
 * Obtiene una compañía específica por su ID.
 * @param {number|string} Id - ID de la compañía a obtener.
 * @returns {Promise<Object|null>} Compañía obtenida o null si no se encuentra.
 * @throws {DatabaseError} Si ocurre un error al obtener la compañía.
 */
export const fetchCompanyById = async (Id) => {
    try {
        const client = await db.connect();
        const { rows } = await client.query(`
            SELECT "Id", "Name"
            FROM "Company"
            WHERE "Id" = $1;
        `, [Id]);
        client.release();

        const company = rows[0];
        return company ? formatCompanyData(company) : null;
    } catch (error) {
        handleDatabaseError(error, "fetching");
    }
};