'use server'
import { sql } from "@vercel/postgres";

export const fetchOrders = async () => {
    try {
        const response = await sql`SELECT o."Date", o."Id", ot."Name" AS "Type", c."Name" AS "Company", o."Price", o."Observation" FROM "Orders" o INNER JOIN "Order_Types" ot ON o."Type" = ot."Id" INNER JOIN "Company" c ON o."Company" = c."Id" ORDER BY "Date" ASC`;
        const title = response?.fields?.map(
            fields => ({
                name: fields.name
            })
        )
        const data = response?.rows?.map(
            orders => ({
                Date: new Date(orders.Date).toLocaleString('es-es', { year: 'numeric', month: 'numeric', day: 'numeric' }),
                Id: orders.Id,
                Type: orders.Type,
                Company: orders.Company,
                Price: orders.Price,
                Observation: orders.Observation
            })
        )
        const orders = {
            title: title,
            data: data
        }
        return orders
    }
    catch (error) {
        throw new Error(error)
    }
}