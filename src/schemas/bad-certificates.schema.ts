import mongoose from "mongoose";
const { Schema } = mongoose;

export const badCertificatesSchema = new Schema({
  id: { type: Number,index:true },
});
