import mongoose from "mongoose";
import { badCertificatesSchema} from "../schemas";

export const badCertificates = mongoose.model("bad_certificates", badCertificatesSchema)