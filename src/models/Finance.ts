import mongoose, { Schema, Document } from "mongoose";

export interface IFinance extends Document {

    type: "income" | "expense";
    amount: number;
    category: mongoose.Types.ObjectId;
    description?: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const FinanceSchema: Schema = new Schema(
    {
        type: { type: String, enum: ["income", "expense"], required: true },
        amount: { type: Number, required: true },
        category: { type: Schema.Types.ObjectId, ref: "FinanceCategory", required: true },
        description: { type: String },
        date: { type: Date, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Finance || mongoose.model<IFinance>("Finance", FinanceSchema);


