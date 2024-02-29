import mongoose from "mongoose";

export async function mongoConnect() {
  const mongo = await mongoose.connect(process.env.MONGO!,{autoIndex:true})
  return mongo;
}
