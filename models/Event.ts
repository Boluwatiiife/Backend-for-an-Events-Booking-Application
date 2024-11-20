import mongoose, { Schema, Model } from "mongoose";
import { IEvent } from "./IEvents";

let eventSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: String, required: true },
    info: { type: String, required: true },
    type: { type: String, required: true },
  },
  { timestamps: true }
);

let Event: Model<IEvent> = mongoose.model<IEvent>("events", eventSchema);
export default Event;
