import { NextResponse } from "next/server";

const fallbackQuotes = [
    { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { content: "La vie est un mystère qu'il faut vivre, et non un problème à résoudre.", author: "Gandhi" },
    { content: "Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès.", author: "Albert Schweitzer" },
    { content: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { content: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { content: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
    { content: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
    { content: "Happiness depends upon ourselves.", author: "Aristotle" },
    { content: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { content: "Don’t count the days, make the days count.", author: "Muhammad Ali" },
    { content: "Everything you can imagine is real.", author: "Pablo Picasso" },
    { content: "What we think, we become.", author: "Buddha" },
    { content: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
    { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
];

export async function GET() {
    try {
        const res = await fetch("https://api.quotable.io/random", {
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
