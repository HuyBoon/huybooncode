import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("image") as File;
        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            return NextResponse.json({ error: "Only JPEG or PNG allowed" }, { status: 400 });
        }
        if (file.size > maxSize) {
            return NextResponse.json({ error: "Image size must be less than 5MB" }, { status: 400 });
        }

        // Simulate cloud storage by saving locally
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(process.cwd(), "public", "uploads", fileName);
        await writeFile(filePath, buffer);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${fileName}`;
        return NextResponse.json({ url });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Failed to upload image" }, { status: 500 });
    }
}