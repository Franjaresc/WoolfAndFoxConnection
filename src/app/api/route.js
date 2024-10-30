import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";


export async function GET() {

    const companies = await sql`SELECT * FROM "Orders" ORDER BY "Date" ASC `;
    const orders = companies?.rows?.map(
        orders => ({
            Date: new Date(orders.Date).toLocaleString('es-es', { year: 'numeric', month: 'numeric', day: 'numeric' }),
            Id: orders.Id,
            Type: orders.Type,
            Company: orders.Company,
            Price: orders.Price,
            Observation: orders.Observation
        })
    )
    console.log(orders)

    return NextResponse.json({ companies: companies.rows })
}