import mongoose from "mongoose";
import { certificateSearchSchema } from "../schemas/certificate-search.schema";

export const certificateSearchModel = mongoose.model(
  "certificateSearch",
  certificateSearchSchema
);

certificateSearchModel.createIndexes({ idCertificate: 1 });
