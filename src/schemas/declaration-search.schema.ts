import mongoose from "mongoose";
const { Schema } = mongoose;

export const declarationSearchSchema = new Schema({
  idDeclaration: { type: Schema.Types.Mixed },
  idTechnicalReglaments: { type: Schema.Types.Mixed },
  idStatus: { type: Schema.Types.Mixed },
  scheme: { type: Schema.Types.Mixed },
  number: { type: Schema.Types.Mixed, index: true },
  declRegDate: { type: Schema.Types.Mixed },
  declEndDate: { type: Schema.Types.Mixed },
  applicant: { type: Schema.Types.Mixed },
  manufacturer: { type: Schema.Types.Mixed },
  product: { type: Schema.Types.Mixed },
  testingLabs: { type: Schema.Types.Mixed },
  status: { type: Schema.Types.Mixed },
  contactType: { type: Schema.Types.Mixed },
  applicantType: { type: Schema.Types.Mixed },
  declarantType: { type: Schema.Types.Mixed },
  oksm: { type: Schema.Types.Mixed },
  validationFormNormDocDecoded: { type: Schema.Types.Mixed },
  validationObjectType: { type: Schema.Types.Mixed },
  conformityDocType: { type: Schema.Types.Mixed },
  fiasAddrobj: { type: Schema.Types.Mixed },
});
