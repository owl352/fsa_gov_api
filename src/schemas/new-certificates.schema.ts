import mongoose from "mongoose";
const { Schema } = mongoose;

export const newCertificateDetailsSchema = new Schema({
  idCertificate: { type: Number, index: true, unique: true },
  number: { type: Schema.Types.Mixed },
  idStatus: { type: Schema.Types.Mixed },
  status: { type: Schema.Types.Mixed },
  certRegDate: { type: Schema.Types.Mixed },
  certEndDate: { type: Schema.Types.Mixed },
  "applicant.idLegalSubject": { type: Schema.Types.Mixed },
  "applicant.idEgrul": { type: Schema.Types.Mixed },
  "applicant.idApplicantType": { type: Schema.Types.Mixed },
  "applicant.idLegalSubjectType": { type: Schema.Types.Mixed },
  "applicant.fullName": { type: Schema.Types.Mixed },
  "applicant.shortName": { type: Schema.Types.Mixed },
  "applicant.inn": { type: Schema.Types.Mixed },
  "applicant.applicantDocType": { type: Schema.Types.Mixed },
  "manufacturer.idLegalSubject": { type: Schema.Types.Mixed },
  "manufacturer.idEgrul": { type: Schema.Types.Mixed },
  "manufacturer.idLegalSubjectType": { type: Schema.Types.Mixed },
  "manufacturer.fullName": { type: Schema.Types.Mixed },
  "manufacturer.shortName": { type: Schema.Types.Mixed },
  contactType: { type: Schema.Types.Mixed },
  applicantType: { type: Schema.Types.Mixed },
  declarantType: { type: Schema.Types.Mixed },
  oksm: { type: Schema.Types.Mixed },
  product: {
    idProduct: { type: Schema.Types.Mixed },
    idProductOrigin: { type: Schema.Types.Mixed },
    fullName: { type: Schema.Types.Mixed },
    idTnveds: { type: Schema.Types.Mixed },
    tnveds: { type: Schema.Types.Mixed },
  },
  idTechnicalReglaments: { type: Schema.Types.Mixed },
  validationFormNormDocDecoded: { type: Schema.Types.Mixed },
  "testingLabs.regNumber": { type: Schema.Types.Mixed },
  "testingLabs.fullName": { type: Schema.Types.Mixed },
  "certificationAuthority.fullName": { type: Schema.Types.Mixed },
  "certificationAuthority.attestatRegNumber": { type: Schema.Types.Mixed },
});
newCertificateDetailsSchema.index({
  "applicant.fullName": "text",
  "applicant.shortName": "text",
});
