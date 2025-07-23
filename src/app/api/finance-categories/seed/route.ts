
import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnect";
import FinanceCategory from "@/models/FinanceCategory";

const defaultCategories = [
    // Income Categories
    { name: "Freelance Web Development", type: "Income" }, // Specific to primary freelance work
    { name: "International Clients", type: "Income" }, // For payments in USD/EUR from overseas clients
    { name: "Local Clients", type: "Income" }, // For VND-based local projects
    { name: "Digital Products", type: "Income" }, // e.g., selling templates, plugins, or courses
    { name: "Affiliate Income", type: "Income" }, // From referrals or affiliate marketing
    { name: "Consulting", type: "Income" }, // For one-off consulting or training sessions
    { name: "Gifts", type: "Income" }, // Retained from original
    { name: "Investments", type: "Income" }, // Retained from original
    { name: "Side Hustle", type: "Income" }, // Retained for other side projects

    // Expense Categories
    { name: "Rent", type: "Expense" }, // Specific to HCMC, where rent is a major cost
    { name: "Utilities", type: "Expense" }, // Electricity, water, internet
    { name: "Internet Subscription", type: "Expense" }, // Critical for freelancers, separated for clarity
    { name: "Food & Groceries", type: "Expense" }, // Daily meals, street food, groceries
    { name: "Dining Out", type: "Expense" }, // Common in HCMC's vibrant food scene
    { name: "Transportation", type: "Expense" }, // Motorbike fuel, Grab rides, or public transport
    { name: "Motorbike Maintenance", type: "Expense" }, // Common in HCMC due to heavy motorbike use
    { name: "Co-working Space", type: "Expense" }, // For freelancers needing a workspace
    { name: "Software Subscriptions", type: "Expense" }, // e.g., Adobe, Figma, or IDE licenses
    { name: "Cloud Services", type: "Expense" }, // e.g., AWS, Firebase, or hosting costs
    { name: "Hardware & Equipment", type: "Expense" }, // Laptops, monitors, or upgrades
    { name: "Professional Development", type: "Expense" }, // Courses, certifications, or workshops
    { name: "Networking Events", type: "Expense" }, // Meetups or tech events in HCMC
    { name: "Healthcare", type: "Expense" }, // Insurance or medical costs
    { name: "Entertainment", type: "Expense" }, // Movies, events, or nightlife
    { name: "Shopping", type: "Expense" }, // Clothing, electronics, etc.
    { name: "Travel", type: "Expense" }, // Domestic or international trips
    { name: "Taxes & Fees", type: "Expense" }, // Freelance taxes or bank fees
    { name: "Debt Repayment", type: "Expense" }, // Retained from original
    { name: "Charity & Gifts", type: "Expense" }, // Donations or gifts for family/friends

    // Other Categories
    { name: "Savings", type: "Other" }, // Retained from original
    { name: "Emergency Fund", type: "Other" }, // For unexpected expenses
    { name: "Investments", type: "Other" }, // For allocating funds to investments
    { name: "Transfers", type: "Other" }, // Bank transfers or moving money
    { name: "Miscellaneous", type: "Other" }, // Catch-all for unclassified expenses
];

export async function POST() {
    await dbConnect();

    try {
        const count = await FinanceCategory.countDocuments();
        if (count > 0) {
            return NextResponse.json(
                { error: "Categories already exist" },
                { status: 400 }
            );
        }

        const inserted = await FinanceCategory.insertMany(defaultCategories);
        const formattedCategories = inserted.map((cat) => ({
            id: cat._id.toString(),
            name: cat.name,
            type: cat.type,
            createdAt: cat.createdAt.toISOString(),
            updatedAt: cat.updatedAt.toISOString(),
        }));
        return NextResponse.json(
            {
                message: "Categories seeded successfully",
                categories: formattedCategories,
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to seed categories" },
            { status: 500 }
        );
    }
}