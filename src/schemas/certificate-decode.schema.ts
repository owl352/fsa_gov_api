import mongoose from "mongoose";
const { Schema } = mongoose;

export const certificateDecodeSchema = new Schema({
  idCert: { type: Number, index: true, unique: true },
  addressType: { type: Schema.Types.Mixed, index: true },
  validationScheme2: { type: Schema.Types.Mixed, index: true },
  validationObjectType: { type: Schema.Types.Mixed, index: true },
  conformityDocType: { type: Schema.Types.Mixed, index: true },
  status: { type: Schema.Types.Mixed, index: true },
  declarantType: { type: Schema.Types.Mixed, index: true },
  applicantType: { type: Schema.Types.Mixed, index: true },
  legalForm: { type: Schema.Types.Mixed, index: true },
  contactType: { type: Schema.Types.Mixed, index: true },
  oksm: { type: Schema.Types.Mixed, index: true },
  fiasAddrobj: { type: Schema.Types.Mixed, index: true },
  tnved: { type: Schema.Types.Mixed, index: true },
  applicantDocType: { type: Schema.Types.Mixed, index: true },
  validationFormNormDoc: { type: Schema.Types.Mixed, index: true },
  dicNormDoc: { type: Schema.Types.Mixed, index: true },
  techregProductListEEU: { type: Schema.Types.Mixed, index: true },
  annexType: { type: Schema.Types.Mixed, index: true },
});
