import mongoose from "mongoose";
import { certificateDecodeSchema } from "../schemas";

export const certificateDecodeModel = mongoose.model("certificate_decodes", certificateDecodeSchema)
certificateDecodeModel.createIndexes({ idCert: 1 });