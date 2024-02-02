import { CertificatesFilters } from "../@types";
import { newCertificateModel } from "../models/new-certificate.model";

export async function findCertificatesBeta(
  filters: CertificatesFilters | null,
  isShorted?: boolean
) {
  const filtersQuery: any = {};

  if (filters != null) {
    const {
      certRegDate,
      certEndDate,
      idCertificate,
      idStatus,
      number,
      inn,
      applicantShortName,
      applicantFullName,
      manufacturerShortName,
      manufacturerFullName,
      productFullName,
      testingLabsRegNumber,
      testingLabsFullName,
      certificationAuthorityFullName,
      certificationAuthorityAttestatRegNumber,
      validationObjectType,
      conformityDocType,
      status,
      contactType,
      oksm,
      fiasAddrobj,
      tnvedName,
      tnvedCode,
      tnvedCodePart,
      validationFormNormDocName,
      validationFormNormDocNum,
      techregProductListEEU,
    } = filters;

    filtersQuery.certRegDate = certRegDate || undefined;
    filtersQuery.certEndDate = certEndDate || undefined;
    filtersQuery.idCertificate = idCertificate || undefined;
    filtersQuery.idStatus = idStatus || undefined;
    filtersQuery.number = number ? { $regex: number } : undefined;
    filtersQuery["applicant.inn"] = inn || undefined;
    filtersQuery["applicant.fullName"] = applicantFullName
      ? {
          $in: [
            new RegExp(`\\B ${applicantFullName} \\B`, "gi"),
            new RegExp(`\\B ${applicantFullName},\\B`, "gi"),
            new RegExp(`\\B"${applicantFullName}"\\B`, "gi"),
            new RegExp(`\\B ${applicantFullName}"\\B`, "gi"),
            new RegExp(`\\B"${applicantFullName} \\B`, "gi"),
            new RegExp(`\\B${applicantFullName}"\\B`, "gi"),
            new RegExp(`\\B"${applicantFullName}\\B`, "gi"),
            // new RegExp(`\\B${applicantFullName}\\B`, "gi"),
          ],
        }
      : undefined;
    filtersQuery["applicant.shortName"] = applicantShortName
      ? {
          $in: [
            new RegExp(`\\B ${applicantShortName} \\B`, "gi"),
            new RegExp(`\\B ${applicantShortName},\\B`, "gi"),
            new RegExp(`\\B"${applicantShortName}"\\B`, "gi"),
            new RegExp(`\\B ${applicantShortName}"\\B`, "gi"),
            new RegExp(`\\B"${applicantShortName} \\B`, "gi"),
            new RegExp(`\\B${applicantShortName}"\\B`, "gi"),
            new RegExp(`\\B"${applicantShortName}\\B`, "gi"),
            // new RegExp(`\\B${applicantShortName}\\B`, "gi"),
          ],
        }
      : undefined;
    filtersQuery["manufacturer.shortName"] = manufacturerShortName
      ? {
          $in: [
            new RegExp(`\\B ${manufacturerShortName} \\B`, "gi"),
            new RegExp(`\\B ${manufacturerShortName},\\B`, "gi"),
            new RegExp(`\\B"${manufacturerShortName}"\\B`, "gi"),
            new RegExp(`\\B ${manufacturerShortName}"\\B`, "gi"),
            new RegExp(`\\B"${manufacturerShortName} \\B`, "gi"),
            new RegExp(`\\B${manufacturerShortName}"\\B`, "gi"),
            new RegExp(`\\B"${manufacturerShortName}\\B`, "gi"),
            // new RegExp(`\\B${manufacturerShortName}\\B`, "gi"),
          ],
        }
      : undefined;
    filtersQuery["manufacturer.fullName"] = manufacturerFullName
      ? {
          $in: [
            new RegExp(`\\B ${manufacturerFullName} \\B`, "gi"),
            new RegExp(`\\B ${manufacturerFullName},\\B`, "gi"),
            new RegExp(`\\B"${manufacturerFullName}"\\B`, "gi"),
            new RegExp(`\\B ${manufacturerFullName}"\\B`, "gi"),
            new RegExp(`\\B"${manufacturerFullName} \\B`, "gi"),
            new RegExp(`\\B${manufacturerFullName}"\\B`, "gi"),
            new RegExp(`\\B"${manufacturerFullName}\\B`, "gi"),
            // new RegExp(`\\B${manufacturerFullName}\\B`, "gi"),
          ],
        }
      : undefined;
    filtersQuery["product.fullName"] = productFullName
      ? {
          $in: [
            new RegExp(`\\B ${productFullName} \\B`, "gi"),
            new RegExp(`\\B ${productFullName},\\B`, "gi"),
            new RegExp(`\\B"${productFullName}"\\B`, "gi"),
            new RegExp(`\\B ${productFullName}"\\B`, "gi"),
            new RegExp(`\\B"${productFullName} \\B`, "gi"),
            new RegExp(`\\B${productFullName}"\\B`, "gi"),
            new RegExp(`\\B"${productFullName}\\B`, "gi"),
            // new RegExp(`\\B${productFullName}\\B`, "gi"),
          ],
        }
      : undefined;
    filtersQuery["testingLabs.regNumber"] = testingLabsRegNumber
      ? { $regex: testingLabsRegNumber }
      : undefined;
    filtersQuery["testingLabs.fullName"] = testingLabsFullName
      ? { $regex: testingLabsFullName }
      : undefined;
    filtersQuery["certificationAuthority.fullName"] =
      certificationAuthorityFullName
        ? { $regex: certificationAuthorityFullName }
        : undefined;
    filtersQuery["certificationAuthority.attestatRegNumber"] =
      certificationAuthorityAttestatRegNumber
        ? { $regex: certificationAuthorityAttestatRegNumber }
        : undefined;
    filtersQuery["status.name"] = status ? { $regex: status } : undefined;
    filtersQuery["contactType"] = contactType
      ? {
          $elemMatch: {
            $elemMatch: {
              name: { $regex: contactType },
            },
          },
        }
      : undefined;
    filtersQuery["oksm"] = oksm
      ? {
          oksm: { $elemMatch: { $elemMatch: { shortName: { $regex: oksm } } } },
        }
      : undefined;
    filtersQuery["product.tnveds"] = tnvedName
      ? { $elemMatch: { $elemMatch: { name: { $regex: tnvedName } } } }
      : undefined;
    filtersQuery["product.tnveds"] = filters.tnvedCodePart
      ? {
          $elemMatch: {
            $elemMatch: {
              code: { $regex: new RegExp(`^${filters.tnvedCodePart}`) },
            },
          },
        }
      : filters.tnvedCode || undefined;
    filtersQuery["validationFormNormDocDecoded"] = validationFormNormDocName
      ? {
          $elemMatch: {
            $elemMatch: {
              name: { $regex: validationFormNormDocName },
            },
          },
        }
      : undefined;
    filtersQuery["validationFormNormDocDecoded"] = validationFormNormDocNum
      ? {
          $elemMatch: {
            $elemMatch: {
              docNum: { $regex: validationFormNormDocNum },
            },
          },
        }
      : undefined;
  }

  const skip = (filters?.page || 0) * 50;
  console.log(
    Object.fromEntries(
      Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)
    )
  );
  const out = await newCertificateModel
    .aggregate([
      {
        $sort: {
          idCertificate: -1,
        },
      },
      {
        $match: Object.fromEntries(
          Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)
        ),
      },

      {
        $project: {
          _id: 0,
          idCertificate: 1,
          number: 1,
          idStatus: 1,
          status: 1,
          certRegDate: 1,
          certEndDate: 1,
          applicant: 1,
          manufacturer: 1,
          contactType: 1,
          applicantType: 1,
          declarantType: 1,
          oksm: 1,
          product: 1,
          idTechnicalReglaments: 1,
          validationFormNormDocDecoded: 1,
          testingLabs: 1,
          certificationAuthority: 1,
        },
      },

      {
        $skip: skip,
      },
      {
        $limit: isShorted ? 25 : 50,
      },
    ])
    .allowDiskUse(true)
    .exec();
  console.log("out");
  return out;
}
