import { Schema } from "mongoose";

export const metricsScheme: Schema = new Schema({
  firstLogin: { type: Date },
  ip: { type: String, indexed: true },
  logins: {
    type: Array<{
      time: { type: Date };
      url: { type: String };
      query: { type: Schema.Types.Mixed };
      params: { type: Schema.Types.Mixed };
      body: { type: Schema.Types.Mixed };
      "user-agent": { type: String };
      browser: { type: String };
      platform: { type: String };
    }>,
  },
});
