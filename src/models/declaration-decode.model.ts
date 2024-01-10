import mongoose from "mongoose";
import { declarationDecodeSchema } from "../schemas";

export const declarationDecodeModel = mongoose.model("declaration_decodes", declarationDecodeSchema)