import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";
import BlogCategory from "@/models/BlogCategory";
import { BlogCategoryType } from "@/types/interface";

const defaultCategories = [
    { name: "Technology" },
    { name: "Lifestyle" },
    { name: "Travel" },
    { name: "Food" },
    { name: "Education" },
    { name: "Health" },
    { name: "Miscellaneous" },
];

// Helper: Format document to API type
const formatCategory = (cat: any): BlogCategoryType => ({
    id: cat._id.toString(),
    name: cat.name,

});

export async function POST() {
    await dbConnect();

    try {
        const count = await BlogCategory.countDocuments();
        if (count > 0) {
            return NextResponse.json(
                { error: "Blog categories already exist" },
                { status: 400 }
            );
        }

        const inserted = await BlogCategory.insertMany(defaultCategories);
        const formattedCategories: BlogCategoryType[] = inserted.map(formatCategory);
        return NextResponse.json(
            {
                message: "Blog categories seeded successfully",
                categories: formattedCategories,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error seeding blog categories:", error);
        return NextResponse.json(
            { error: "Failed to seed blog categories", details: error.message },
            { status: 500 }
        );
    }
}