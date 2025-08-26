import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";
import BlogCategory from "@/models/BlogCategory";
import Blog from "@/models/Blog";

export async function DELETE() {
    await dbConnect();

    try {
        // Check if any blogs are using categories
        const blogCount = await Blog.countDocuments({ blogcategory: { $exists: true, $ne: null } });
        if (blogCount > 0) {
            return NextResponse.json(
                { error: "Cannot delete categories because they are used by blogs" },
                { status: 400 }
            );
        }

        await BlogCategory.deleteMany({});
        return NextResponse.json(
            { message: "All blog categories deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error deleting blog categories:", error);
        return NextResponse.json(
            { error: "Failed to delete blog categories", details: error.message },
            { status: 500 }
        );
    }
}