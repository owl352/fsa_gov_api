import mongoose from "mongoose";

export async function mongoConnect() {
  await mongoose.connect(process.env.MONGO!,{autoIndex:false}).then(()=>{
    console.log('connected!')
  });
  return;
}
