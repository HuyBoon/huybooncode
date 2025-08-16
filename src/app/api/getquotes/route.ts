import { NextResponse } from "next/server";

const fallbackQuotes = [
    { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { content: "La vie est un mystère qu'il faut vivre, et non un problème à résoudre.", author: "Gandhi" },
    { content: "Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès.", author: "Albert Schweitzer" },
    { content: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { content: "The best way to predict the future is to create it.", author: "Peter Drucker" },
];

export async function GET() {
    try {
        const res = await fetch("https://api.api-ninjas.com/v1/quotes", {
            cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        return NextResponse.json({
            content: data.quote,
            author: data.author,
        });
    } catch (error) {
        // Trả fallback quote thay vì 500
        const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        return NextResponse.json(randomQuote, { status: 200 });
    }
}
