import mongoose from "mongoose";
import { newCertificateDetailsSchema } from "../schemas/new-certificates.schema";

export const newCertificateModel = mongoose.model(
  "certificatedetails_without_duplicates",
  newCertificateDetailsSchema
);