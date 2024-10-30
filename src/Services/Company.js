'use server'
import { sql } from "@vercel/postgres";

export const fetchCompany = async () => {
    try {
        const response = await sql`SELECT * FROM "Company" ORDER BY "Id" ASC `;
        const title = response?.fields?.map(
            fields => ({
                name: fields.name
            })
        )
        const data = response?.rows?.map(
            company => ({
                Id: company.Id,
                Name: company.Name,
            })
        )
        const company = {
            title: title,
            data: data
        }
        return company
    }
    catch (error){
        throw new Error(error)
    }
}