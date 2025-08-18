
import { dbConnect } from "@/libs/dbConnection";

import { User } from "@/models/User";
import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { name, email, password, role = "user" } = body;

        // Validate fields
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Please provide name, email, and password" },
                { status: 400 }
            );
        }

        if (password.length < 5) {
            return NextResponse.json(
                { message: "Password must be at least 5 characters" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "Email is already registered" },
                { status: 400 }
            );
        }

        // If creating admin, check if requester is admin
        if (role === "admin") {
            const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

            if (!token || token.role !== "admin") {
                return NextResponse.json(
                    { message: "Only admins can create other admin users" },
                    { status: 403 }
                );
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const createdUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role, // "admin" or "user"
        });

        // Exclude password from response
        const { password: _, ...userWithoutPassword } = createdUser.toObject();

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { message: "Something went wrong", error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
