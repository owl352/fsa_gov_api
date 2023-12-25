import mongoose from "mongoose";
import { badDeclarationSchema } from "../schemas";

export const badDeclarationModel = mongoose.model("bad_declarations", badDeclarationSchema)