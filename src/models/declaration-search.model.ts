import mongoose from "mongoose";
import { declarationSearchSchema } from "../schemas";

export const declarationSearchModel = mongoose.model(
  "dc_exps",
  declarationSearchSchema
);

declarationSearchModel.createIndexes({ number: 1, name: "number_1" });
