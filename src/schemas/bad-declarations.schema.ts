import mongoose from "mongoose";
const { Schema } = mongoose;

export const badDeclarationSchema = new Schema({
  id: { type: Number, index:true},
});
