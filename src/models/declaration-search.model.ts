import mongoose from "mongoose";
import { declarationSearchSchema } from "../schemas";

export const declarationSearchModel = mongoose.model(
  "dc_exp",
  declarationSearchSchema
);

declarationSearchModel.createIndexes({ idDeclaration: 1 });
