import { CertificatesFilters } from "../@types";
import { certificateSearchModel } from "../models";

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
    console.log(
      new RegExp(
        `((?!\W)|^)${filters.applicantShortName}(?!\w)(?!\W\S)|(?!\w\S)${filters.applicantShortName}(?!\w|\S)`,
        "i"
      )
    );
    filtersQuery.certRegDate = certRegDate || undefined;
    filtersQuery.certEndDate = certEndDate || undefined;
    filtersQuery.idCertificate = idCertificate || undefined;
    filtersQuery.idStatus = idStatus || undefined;
    filtersQuery.number = number ? { $regex: number } : undefined;
    filtersQuery["applicant.inn"] = inn || undefined;
    // filtersQuery["applicant.fullName"] = applicantFullName
    //   ? {
    //       $text: { $search: `"${applicantFullName}"` },
    //       // $regex: new RegExp(
    //       //   `(?<!\\w)(?<!\\s)${applicantFullName}(?!\\w)(?<!\\s)|(?<!\\w\\S)${applicantFullName}(?!\\w|\\S)`,
    //       //   "i"
    //       // ),
    //     }
    //   : undefined;
    filtersQuery["$text"] =
      filters.applicantShortName || filters.applicantFullName
        ? {
            $search: `\"${applicantShortName ?? ""}\" \"${
              applicantFullName ?? ""
            }\"`,
          }
        : undefined;
    filtersQuery["manufacturer.shortName"] = manufacturerShortName
      ? {
          $regex: new RegExp(
            `((?![А-ЯA-z])|\\s)${manufacturerShortName}((?![А-ЯA-z])|\\s)`,
            "i"
          ),
        }
      : undefined;
    filtersQuery["manufacturer.fullName"] = manufacturerFullName
      ? {
          $regex: new RegExp(
            `((?![А-ЯA-z])|\\s)${manufacturerFullName}((?![А-ЯA-z])|\\s)`,
            "i"
          ),
        }
      : undefined;
    filtersQuery["product.fullName"] = productFullName
      ? {
          $regex: new RegExp(
            `((?![А-ЯA-z])|\\s)${productFullName}((?![А-ЯA-z])|\\s)`,
            "i"
          ),
        }
      : undefined;
    filtersQuery["testingLabs.regNumber"] = testingLabsRegNumber
      ? { $regex: testingLabsRegNumber }
      : undefined;
    filtersQuery["testingLabs.fullName"] = testingLabsFullName
      ? {
          $regex: new RegExp(
            `((?![А-ЯA-z])|\\s)${testingLabsFullName}((?![А-ЯA-z])|\\s)`,
            "i"
          ),
        }
      : undefined;
    filtersQuery["certificationAuthority.fullName"] =
      certificationAuthorityFullName
        ? {
            $regex: new RegExp(
              `((?![А-ЯA-z])|\\s)${certificationAuthorityFullName}((?![А-ЯA-z])|\\s)`,
              "i"
            ),
          }
        : undefined;
    filtersQuery["certificationAuthority.attestatRegNumber"] =
      certificationAuthorityAttestatRegNumber
        ? { $regex: certificationAuthorityAttestatRegNumber }
        : undefined;
    filtersQuery["status.name"] = status ? { $regex: status } : undefined;
    filtersQuery["contactType.name"] = contactType
      ? { $regex: contactType }
      : undefined;
    filtersQuery["oksm.shortName"] = oksm ? { $regex: oksm } : undefined;
    filtersQuery["product.tnveds"] = tnvedName
      ? { $elemMatch: { $elemMatch: { name: { $regex: tnvedName } } } }
      : undefined;
    filtersQuery["product.tnveds"] = tnvedCodePart
      ? { $elemMatch: { $elemMatch: { code: { $regex: tnvedCodePart } } } }
      : tnvedCode
      ? { $elemMatch: { $elemMatch: { code: tnvedCode } } }
      : undefined;
    filtersQuery["validationFormNormDocDecoded.name"] =
      validationFormNormDocName
        ? { $regex: validationFormNormDocName }
        : undefined;
    filtersQuery["validationFormNormDocDecoded.docNum"] =
      validationFormNormDocNum
        ? { $regex: validationFormNormDocNum }
        : undefined;
    filtersQuery["validationObjectType.name"] = validationObjectType
      ? { $regex: validationObjectType }
      : undefined;
    filtersQuery["conformityDocType.name"] = conformityDocType
      ? { $regex: conformityDocType }
      : undefined;
    filtersQuery["techregProductListEEU.name"] = techregProductListEEU
      ? { $regex: techregProductListEEU }
      : undefined;
    filtersQuery["fiasAddrobj.offname"] = fiasAddrobj
      ? { $regex: fiasAddrobj }
      : undefined;
  }

  const skip = (filters?.page || 0) * 50;

  console.log(filtersQuery);
  const out = await certificateSearchModel
    .find(
      Object.fromEntries(
        Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)
      )
    )
    .skip(skip)
    .limit(isShorted ? 25 : 50)
    .lean();
    // .allowDiskUse(true)
    // .sort({ idCertificate: -1 })
  // .aggregate([
  //   {
  //     $sort: {
  //       idCertificate: -1,
  //     },
  //   },
  //   {
  // $match: Object.fromEntries(
  //   Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)
  // ),
  //   },

  //   {
  //     $project: {
  //       _id: 0,
  //       idCertificate: 1,
  //       number: 1,
  //       idStatus: 1,
  //       status: 1,
  //       certRegDate: 1,
  //       certEndDate: 1,
  //       applicant: 1,
  //       manufacturer: 1,
  //       contactType: 1,
  //       applicantType: 1,
  //       declarantType: 1,
  //       oksm: 1,
  //       product: 1,
  //       idTechnicalReglaments: 1,
  //       validationFormNormDocDecoded: 1,
  //       testingLabs: 1,
  //       certificationAuthority: 1,
  //     },
  //   },

  //   {
  //     $skip: skip,
  //   },
  //   {
  //     $limit: isShorted ? 25 : 50,
  //   },
  // ])
  // .allowDiskUse(true)
  // .exec();
  console.log("out");
  return out;
}
