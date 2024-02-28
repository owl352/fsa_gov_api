import { DeclarationFilters } from "../@types";
import { declarationSearchModel } from "../models";

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
    } = filters;

    filtersQuery.declRegDate = declRegDate || undefined;
    filtersQuery.declEndDate = declEndDate || undefined;
    filtersQuery.idDeclaration = idDeclaration || undefined;
    filtersQuery.idStatus = idStatus || undefined;
    filtersQuery.number = number ? { $regex: number } : undefined;
    filtersQuery["applicant.inn"] = inn || undefined;
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
            `(?<!\w)(?<!\s)${manufacturerShortName}(?!\w)(?<!\s)|(?<!\w\S)${manufacturerShortName}(?!\w|\S)`,
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
            `(?<!\w)(?<!\s)${productFullName}(?!\w)(?<!\s)|(?<!\w\S)${productFullName}(?!\w|\S)`,
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
            `(?:^|\\W)${testingLabsFullName}(?!\\w|[А-я0-9A-z])`,
            "i"
          ),
        }
      : undefined;
    filtersQuery["certificationAuthority.fullName"] =
      certificationAuthorityFullName
        ? {
            $regex: new RegExp(
              `(?:^|\\W)${certificationAuthorityFullName}(?!\\w|[А-я0-9A-z])`,
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
  const out = await declarationSearchModel
    .find(
      Object.fromEntries(
        Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)
      )
    )
    .allowDiskUse(true)
    .sort({ idDeclaration: -1 })
    .skip(skip)
    .limit(isShorted ? 25 : 50)
    .lean();

  console.log("out");
  return out;
}
