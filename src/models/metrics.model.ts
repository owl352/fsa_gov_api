import mongoose from "mongoose";
import { metricsScheme } from "../schemas";


export const metricModel = mongoose.model("metrics", metricsScheme);
metricModel.createIndexes({ ip: 1 });
