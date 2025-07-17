import mongoose, { Schema, Document } from "mongoose";

export interface IFinanceCategory extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const FinanceCategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export default mongoose.models.FinanceCategory || mongoose.model<IFinanceCategory>("FinanceCategory", FinanceCategorySchema);