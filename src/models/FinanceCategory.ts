import mongoose, { Schema, Document } from "mongoose";

export interface IFinanceCategory extends Document {
    name: string;
    type: "Income" | "Expense" | "Other";
    createdAt: Date;
    updatedAt: Date;
}

const FinanceCategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        type: {
            type: String,
            enum: ["Income", "Expense", "Other"],
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.FinanceCategory || mongoose.model<IFinanceCategory>("FinanceCategory", FinanceCategorySchema);