import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, trim: true, default: "" },
        start: { type: Date, required: true },
        end: { type: Date, required: true },
        todo: { type: Schema.Types.ObjectId, ref: "Todo", default: null },
    },
    { timestamps: true }
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);