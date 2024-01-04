import { certificateDecodeModel, certificateDetailsModel } from "../models";

export async function findCertificateDetails(id: number) {
  const result = await certificateDetailsModel
    .aggregate([
      {
        $match: { idCertificate: id },
      },
      {
        $lookup: {
          from: "certificate_decodes",
          localField: "idCertificate",
          foreignField: "idCert",
          as: "certificateDecode",
        },
      },
      {
        $unwind: "$certificateDecode",
      },
    ])
    .exec();

  return result;
}
