import mongoose, { Document } from "mongoose";

export interface IEvent extends Document {
  _id: string;
  name: string;
  image: string;
  price: number;
  date: string;
  info: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}
