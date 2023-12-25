import mongoose from "mongoose";
const { Schema } = mongoose;

export const declarationSchema = new Schema({
  id: { type: Number, index: true, unique: true },
  idStatus: { type: Number },
  Number: { type: String, index: true },
  declNumber: { type: String, index: true },
  declDate: { type: String, index: true },
  declEndDate: { type: String, index: true },
  technicalReglaments: { type: String, index: true },
  group: { type: String, index: true },
  productSingleList: { type: String, index: true },
  declType: { type: String, index: true },
  declObjectType: { type: String, index: true },
  awaitForApprove: { type: String },
  editApp: { type: String },
  idApplicantLegalSubjectType: { type: Number, index: true },
  applicantLegalSubjectType: { type: String, index: true },
  applicantType: { type: String, index: true },
  applicantName: { type: String, index: true },
  applicantAddress: { type: String, index: true },
  applicantOpf: { type: String, index: true },
  applicantFilialFullNames: { type: String, index: true },
  idManufacterLegalSubjectType: { type: Number, index: true },
  manufacterLegalSubjectType: { type: String, index: true },
  manufacterType: { type: String, index: true },
  manufacterName: { type: String },
  manufacterFilialFullNames: { type: String },
  idRalCertificationAuthority: { type: Number, index: true },
  certificationAuthorityAttestatRegNumber: { type: String, index: true },
  productOrig: { type: String },
  productFullName: { type: String, index: true },
  productBatchSize: { type: String },
  productIdentificationName: { type: String, index: true },
  productIdentificationType: { type: String, index: true },
  productIdentificationTrademark: { type: String, index: true },
  productIdentificationModel: { type: String, index: true },
  productIdentificationArticle: { type: String, index: true },
  productIdentificationSort: { type: String, index: true },
  productIdentificationGtin: { type: String, index: true },
  expertFio: { type: String, index: true },
  statusTestingLabs: { type: String, index: false },
});
