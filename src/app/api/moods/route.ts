import { NextResponse } from "next/server";
import { MoodType } from "@/types/interface";

export async function GET() {
    const moods: MoodType[] = [
        { id: "1", name: "Happy", emoji: "😊" },
        { id: "2", name: "Sad", emoji: "😢" },
        { id: "3", name: "Neutral", emoji: "😐" },
        { id: "4", name: "Excited", emoji: "🎉" },
        { id: "5", name: "Anxious", emoji: "😓" },
    ];
    return NextResponse.json(moods);
}