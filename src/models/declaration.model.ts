import mongoose from "mongoose";
import { declarationSchema } from "../schemas";

export const declarationModel = mongoose.model(
  "declaration",
  declarationSchema
);
