import mongoose, { Schema, Document } from "mongoose";

export type FinanceEntryType =
    | "income"
    | "expense"
    | "saving"
    | "investment"
    | "debt"
    | "loan"
    | "other";

export interface IFinance extends Document {
    type: FinanceEntryType;
    amount: number;
    category: mongoose.Types.ObjectId;
    description?: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const FinanceSchema: Schema = new Schema(
    {
        type: { type: String, enum: ["income", "expense", "saving", "investment", "debt", "loan", "other"], required: true },
        amount: { type: Number, required: true },
        category: { type: Schema.Types.ObjectId, ref: "FinanceCategory", required: true },
        description: { type: String },
        date: { type: Date, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Finance || mongoose.model<IFinance>("Finance", FinanceSchema);


