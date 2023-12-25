import { CertificatesFilters } from "../@types";
import { certificateDetailsModel } from "../models";

export async function findCertificates(
  filters: CertificatesFilters,
  page?: number
) {
  const out = await certificateDetailsModel
    .find(
      Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null)),
      {
        idCertificate: 1,
        number: 1,
        idStatus: 1,
        certRegDate: 1,
        certEndDate: 1,
        applicant: 1,
        manufacturer: 1,
        product: 1,
        idTechnicalReglaments: 1,
        testingLabs: 1,
      },
      { skip: 50 * (page ?? 1) }
    )
    .limit(50)
    .lean();
  return out;
}
