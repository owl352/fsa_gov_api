import { certificateDecodeModel } from "../models/certificate-decode.model";

export async function findCertificateDecode(id: Number) {
  const out = await certificateDecodeModel.findOne({ idCert: id }).lean();
  return out;
}
