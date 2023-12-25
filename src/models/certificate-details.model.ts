import mongoose from "mongoose";
import { certificateDetailsSchema } from "../schemas";

export const certificateDetailsModel = mongoose.model("certificateDetails", certificateDetailsSchema)
certificateDetailsModel.createIndexes({ idCertificate: 1 });