import { DeclarationFilters } from "../@types";
import { declarationSearchModel } from "../models";
import { getSearchLocale } from "./get-search-locale.helper";

export async function findDeclarationsBeta(
  filters: DeclarationFilters | null,
  isShorted?: boolean
) {
  const filtersQuery: any = {};

  if (filters != null) {
    const {
      declRegDate,
      declEndDate,
      number,
      idDeclaration,
      idStatus,
      inn,
      applicantFullName,
      applicantShortName,
      manufacturerShortName,
      manufacturerFullName,
      productFullName,
      testingLabsFullName,
      testingLabsRegNumber,
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
      scheme,
    } = filters;

    filtersQuery.declRegDate = declRegDate || undefined;
    filtersQuery.declEndDate = declEndDate || undefined;
    filtersQuery.idDeclaration = idDeclaration || undefined;
    filtersQuery.idStatus = idStatus || undefined;
    filtersQuery.number = number
      ? {
          $regex:
            (getSearchLocale(number) != "en" ? "(*UCP)" : "") +
            "\\b" +
            number +
            "\\b",
        }
      : undefined;
    filtersQuery["applicant.inn"] = inn || undefined;
    filtersQuery["$text"] =
      filters.applicantShortName || filters.applicantFullName
        ? {
            $search: `\"${applicantShortName ?? ""}\" \"${
              applicantFullName ?? ""
            }\"`,
            $diacriticSensitive: true,
          }
        : undefined;
    filtersQuery["manufacturer.shortName"] = manufacturerShortName
      ? {
          $regex:
            (getSearchLocale(manufacturerShortName) != "en" ? "(*UCP)" : "") +
            "\\b" +
            manufacturerShortName +
            "\\b",
        }
      : undefined;

    filtersQuery["manufacturer.fullName"] = manufacturerFullName
      ? {
          $regex:
            (getSearchLocale(manufacturerFullName) != "en" ? "(*UCP)" : "") +
            "\\b" +
            manufacturerFullName +
            "\\b",
        }
      : undefined;
    filtersQuery["product.fullName"] = productFullName
      ? {
          $regex:
            (getSearchLocale(productFullName) != "en" ? "(*UCP)" : "") +
            "\\b" +
            productFullName +
            "\\b",
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
          }
        : undefined;
    filtersQuery["certificationAuthority.attestatRegNumber"] =
      certificationAuthorityAttestatRegNumber
        ? { $regex: certificationAuthorityAttestatRegNumber }
        : undefined;
    filtersQuery["status.name"] = status ? { $regex: status } : undefined;
    filtersQuery["scheme"] = scheme
      ? {
          $regex: `(*UCP)\\b${scheme}\\b`,
        }
      : undefined;
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
    filtersQuery["fiasAddrobj.offname"] = fiasAddrobj
      ? { $regex: fiasAddrobj }
      : undefined;
  }

  const skip = (filters?.page || 0) * 50;

  console.log(filtersQuery);
  if (filters?.number == undefined) {
    const out = await declarationSearchModel
      .find(
        Object.fromEntries(
          Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)
        ),
        null,
        {
          sort: { idDeclaration: -1 },
          limit: isShorted ? 25 : 50,
          skip: skip,
        }
      )
      // .allowDiskUse(true)
      .lean();

    console.log("out");
    return out;
  } else {
    const out = await declarationSearchModel
      .findOne(
        Object.fromEntries(
          Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)
        )
      )
      .lean();
    console.log("out");
    return [out];
  }
}
