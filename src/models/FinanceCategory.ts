import mongoose, { Schema, Document } from "mongoose";

export interface IFinanceCategory extends Document {
    name: string;
    type: "Income" | "Expense" | "Saving" | "Investment" | "Debt" | "Loan" | "Other"
    createdAt: Date;
    updatedAt: Date;
}

const FinanceCategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        type: {
            type: String,
            enum: ["Income", "Expense", "Saving", "Investment", "Debt", "Loan", "Other"],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.FinanceCategory || mongoose.model<IFinanceCategory>("FinanceCategory", FinanceCategorySchema);