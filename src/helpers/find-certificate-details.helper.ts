import { certificateDetailsModel } from "../models";

export async function findCertificateDetails(id: number) {
  const out = await certificateDetailsModel
    .findOne({ idCertificate: id })
    .lean();
  return out;
}
