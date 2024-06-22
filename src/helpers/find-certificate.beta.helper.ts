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
      scheme,
    } = filters;

    filtersQuery.certRegDate = certRegDate || undefined;
    filtersQuery.certEndDate = certEndDate || undefined;
    filtersQuery.idCertificate = idCertificate || undefined;
    filtersQuery.idStatus = idStatus || undefined;
    filtersQuery.number = number
      ? {
          $regex:
            (getSearchLocale(number) != "en" ? "(*UCP)" : "") +
            "\\b" +
            number +
            "\\b",
          $options: "i",
        }
      : undefined;
    filtersQuery["applicant.inn"] = inn || undefined;
    filtersQuery["scheme"] = scheme
      ? {
          $regex: `(*UCP)\\b${scheme
            .toUpperCase()
            .replace("CC", "CС")
            .replace("СС", "CС")}\\b`,
          $options: "i",
        }
      : undefined;
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
              (getSearchLocale(certificationAuthorityFullName) != "en"
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
        ? { $regex: certificationAuthorityAttestatRegNumber, $options: "i" }
        : undefined;
    filtersQuery["status.name"] = status ? { $regex: status } : undefined;
    filtersQuery["contactType.name"] = contactType
      ? { $regex: contactType }
      : undefined;
    filtersQuery["oksm.shortName"] = oksm ? { $regex: oksm } : undefined;
    filtersQuery["product.tnveds.name"] = tnvedName
      ? { $regex: tnvedName }
      : undefined;
    filtersQuery["product.tnveds.code"] = tnvedCodePart
      ? { $regex: tnvedCodePart }
      : tnvedCode
      ? tnvedCode
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
  const query = Object.fromEntries(
    Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)
  );
  const keysToCheck = Object.keys(query);
  let hint: any = {};
  if (!keysToCheck.includes("$text")) {
    if (keysToCheck.includes("manufacturer.fullName")) {
      hint["manufacturer.fullName"] = 1;
    } else if (keysToCheck.includes("manufacturer.shortName")) {
      hint["manufacturer.shortName"] = 1;
    } else if (keysToCheck.includes("number")) {
      hint["number"] = 1;
    } else {
      keysToCheck.forEach((key) => {
        if (
          filtersQuery[key] &&
          Object.keys(hint).length < 1 &&
          key != "$text" &&
          key != "scheme" &&
          key != "idStatus" &&
          key != "product.fullName" &&
          key != "testingLabs.fullName" &&
          key != "testingLabs.regNumber" &&
          key != "certificationAuthority.fullName" &&
          key != "certificationAuthority.attestatRegNumber" &&
          key != "validationFormNormDocDecoded.docNum" &&
          key != "validationFormNormDocDecoded.name"
        ) {
          hint[key] = 1;
        }
      });
    }
  }
  console.log(query);
  console.log(hint);
  const out = await certificateSearchModel
    .find(query)
    .hint(hint)
    .sort("-idCertificate")
    .limit(isShorted ? 25 : 50)
    .skip(skip)
    .lean();
  return out;
}
