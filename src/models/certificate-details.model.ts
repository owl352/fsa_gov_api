import mongoose from "mongoose";
import { certificateDetailsSchema } from "../schemas";

export const certificateDetailsModel = mongoose.model("certificateDetails", certificateDetailsSchema)