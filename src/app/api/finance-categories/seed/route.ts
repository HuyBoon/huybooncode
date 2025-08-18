
import { NextResponse } from "next/server";
import { dbConnect } from "@/libs/dbConnection";

import FinanceCategory from "@/models/FinanceCategory";

const defaultCategories = [
    // Income
    { name: "Monthly Salary", type: "Income" },              // Lương cố định hằng tháng
    { name: "Freelance Web Development", type: "Income" },
    { name: "International Clients", type: "Income" },
    { name: "Local Clients", type: "Income" },
    { name: "Digital Products", type: "Income" },
    { name: "Affiliate Income", type: "Income" },
    { name: "Consulting", type: "Income" },
    { name: "Side Hustle", type: "Income" },
    { name: "Gifts Received", type: "Income" },
    { name: "Dividends & Investments Return", type: "Income" },
    { name: "Other Income", type: "Income" },

    // Expense
    { name: "Rent", type: "Expense" },
    { name: "Utilities", type: "Expense" },
    { name: "Internet Subscription", type: "Expense" },
    { name: "Food & Groceries", type: "Expense" },
    { name: "Dining Out", type: "Expense" },
    { name: "Coffee & Drinks", type: "Expense" },            // ☕ Đi café, trà sữa, nước uống
    { name: "Transportation", type: "Expense" },
    { name: "Motorbike Maintenance", type: "Expense" },
    { name: "Co-working Space", type: "Expense" },
    { name: "Software Subscriptions", type: "Expense" },
    { name: "Cloud Services", type: "Expense" },
    { name: "Hardware & Equipment", type: "Expense" },
    { name: "Professional Development", type: "Expense" },
    { name: "Networking Events", type: "Expense" },
    { name: "Healthcare", type: "Expense" },
    { name: "Insurance Premiums", type: "Expense" },
    { name: "Entertainment", type: "Expense" },
    { name: "Shopping", type: "Expense" },
    { name: "Travel", type: "Expense" },
    { name: "Taxes & Fees", type: "Expense" },
    { name: "Charity & Donations", type: "Expense" },
    { name: "Gifts for Others", type: "Expense" },
    { name: "Debt Repayment", type: "Expense" },
    { name: "Bank Charges", type: "Expense" },
    { name: "Other Expenses", type: "Expense" },

    // Saving
    { name: "Savings", type: "Saving" },
    { name: "Emergency Fund", type: "Saving" },
    { name: "Retirement Fund", type: "Saving" },

    // Investment
    { name: "Stocks", type: "Investment" },
    { name: "Crypto", type: "Investment" },
    { name: "Real Estate", type: "Investment" },
    { name: "Business Investment", type: "Investment" },
    { name: "P2P Lending", type: "Investment" },
    { name: "Other Investments", type: "Investment" },

    // Debt
    { name: "Credit Card Debt", type: "Debt" },
    { name: "Personal Loan (Bank)", type: "Debt" },
    { name: "Mortgage", type: "Debt" },
    { name: "Family/Friends Loan", type: "Debt" },

    // Loan
    { name: "Loan to Friend/Family", type: "Loan" },
    { name: "Business Loan Given", type: "Loan" },
    { name: "Personal Lending", type: "Loan" },

    // Other
    { name: "Transfers", type: "Other" },
    { name: "Wallet Top-up", type: "Other" },
    { name: "Withdrawals", type: "Other" },
    { name: "Miscellaneous", type: "Other" }
];

export async function POST() {
    await dbConnect();

    try {
        const count = await FinanceCategory.countDocuments();
        console.log("Existing categories count:", count);
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