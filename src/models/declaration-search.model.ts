import mongoose from "mongoose";
import { declarationSearchSchema } from "../schemas";

export const declarationSearchModel = mongoose.model(
  "dc_exps",
  declarationSearchSchema
);

declarationSearchModel.createIndexes({
  "manufacturer.fullName": 1,
  declRegDate: -1,
});
