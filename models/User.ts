import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "./IUser";

let UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, required: true },
    isAdmin: { type: Boolean, default: true },
  },
  { timestamps: true }
);

let User: Model<IUser> = mongoose.model("User", UserSchema);

export default User;
