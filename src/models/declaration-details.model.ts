import mongoose from "mongoose";
import { declarationDetailsSchema } from "../schemas";

export const declarationDetailsModel = mongoose.model(
  "declarationDetails",
  declarationDetailsSchema
);
declarationDetailsModel.createIndexes({ idDeclaration: 1 });
