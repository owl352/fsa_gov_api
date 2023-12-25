import mongoose from "mongoose";
import { certificateSchema } from "../schemas";

export const certificateModel = mongoose.model("certificate", certificateSchema)
certificateModel.createIndexes({ id: 1 });
