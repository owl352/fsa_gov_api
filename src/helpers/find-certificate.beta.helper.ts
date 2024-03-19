import { CertificatesFilters } from "../@types";
import { certificateSearchModel } from "../models";
import { getSearchLocale } from "./get-search-locale.helper";

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
    filtersQuery["$text"] =
      filters.applicantShortName || filters.applicantFullName
        ? {
            $search: `\"${applicantShortName ?? ""}\" \"${
              applicantFullName ?? ""
            }\"`,
            $diacriticSensitive: false,
          }
        : undefined;
    filtersQuery["manufacturer.shortName"] = manufacturerShortName
      ? {
          $regex:
            (getSearchLocale(manufacturerShortName) != "en" ? "(*UCP)" : "") +
            "\\b" +
            manufacturerShortName +
            "\\b",
          $options: "i",
        }
      : undefined;
    filtersQuery["manufacturer.fullName"] = manufacturerFullName
      ? {
          $regex:
            (getSearchLocale(manufacturerFullName) != "en" ? "(*UCP)" : "") +
            "\\b" +
            manufacturerFullName +
            "\\b",
          $options: "i",
        }
      : undefined;
    filtersQuery["product.fullName"] = productFullName
      ? {
          $regex:
            (getSearchLocale(productFullName) != "en" ? "(*UCP)" : "") +
            "\\b" +
            productFullName +
            "\\b",
          $options: "i",
        }
      : undefined;
    filtersQuery["testingLabs.regNumber"] = testingLabsRegNumber
      ? { $regex: testingLabsRegNumber }
      : undefined;
    filtersQuery["testingLabs.fullName"] = testingLabsFullName
      ? {
          $regex:
            (getSearchLocale(testingLabsFullName) != "en" ? "(*UCP)" : "") +
            "\\b" +
            testingLabsFullName +
            "\\b",
          $options: "i",
        }
      : undefined;

    filtersQuery["certificationAuthority.fullName"] =
      certificationAuthorityFullName
        ? {
            $regex:
              (getSearchLocale(certificationAuthorityFullName) == "en"
                ? "(*UCP)"
                : "") +
              "\\b" +
              certificationAuthorityFullName +
              "\\b",
            $options: "i",
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
  if (filters?.number == undefined) {
    const out = await certificateSearchModel
      .find(
        Object.fromEntries(
          Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)
        ),
        null,
        {
          sort: { idCertificate: -1 },
          skip: skip,
          limit: isShorted ? 25 : 50,
        }
      )
      .lean();
    // .skip(skip)
    // .limit()

    console.log("out");
    return out;
  } else {
    const out = await certificateSearchModel
      .findOne(
        Object.fromEntries(
          Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)
        )
      )
      .lean();

    console.log("out");
    return out;
  }
}
