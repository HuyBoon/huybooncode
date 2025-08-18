import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";

import Category from "@/models/Category";
import { CategoryType } from "@/types/interface";

const defaultCategories = [
    { name: "Work" },
    { name: "Personal" },
    { name: "Study" },
    { name: "Health" },
    { name: "Hobbies" },
    { name: "Events" },
    { name: "Miscellaneous" },
];

// Helper: Format document to API type
const formatCategory = (cat: any): CategoryType => ({
    id: cat._id.toString(),
    name: cat.name,

});

export async function POST() {
    await dbConnect();

    try {
        const count = await Category.countDocuments();
        if (count > 0) {
            return NextResponse.json(
                { error: "Categories already exist" },
                { status: 400 }
            );
        }

        const inserted = await Category.insertMany(defaultCategories);
        const formattedCategories: CategoryType[] = inserted.map(formatCategory);
        return NextResponse.json(
            {
                message: "Todo categories seeded successfully",
                categories: formattedCategories,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error seeding todo categories:", error);
        return NextResponse.json(
            { error: "Failed to seed todo categories" },
            { status: 500 }
        );
    }
}