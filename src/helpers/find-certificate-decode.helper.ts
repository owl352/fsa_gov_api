import { certificateDecodeModel } from "../models";

export async function findCertificateDecode(id: Number) {
  const out = await certificateDecodeModel.findOne({ idCert: id }).lean();
  return out;
}
