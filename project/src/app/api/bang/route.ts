import mysql from "../../../../lib/mysql";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const results = await new Promise((resolve, reject) => {
      mysql.query("SELECT * FROM User", (error: any, results: []) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    console.log("Test Connection Result:", results);
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
