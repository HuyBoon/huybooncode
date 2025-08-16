// app/api/getquotes/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch("https://api.quotable.io/random");
        if (!res.ok) {
            throw new Error(`Failed to fetch: ${res.status}`);
        }
        const data = await res.json();
        return NextResponse.json({
            content: data.content,
            author: data.author,
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch quote" },
            { status: 500 }
        );
    }
}
