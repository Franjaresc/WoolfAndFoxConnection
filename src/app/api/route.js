import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";


export async function GET() {

    const response = await sql`
            INSERT INTO "Orders"(
	"Date", "Id", "Type", "Company", "Price", "Observation")
	VALUES ('12/11/1999', '123456789', 1, 1, 12, '') 
            RETURNING "Id";`;
        return NextResponse.json({ response })
}