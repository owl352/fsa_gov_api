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
            '(^|((?![А-ЯA-z])[.,\\/#!$%\\^&\\*;"«»:{}=\\-_`~()])|\\s|\\b)' +
              manufacturerShortName +
              '(((?![А-ЯA-z])[.,\\/#!$%\\^&\\*;"«»:{}=\\-_`~()])|\\s|\\b|$)',
            "i"
          ),
        }
      : undefined;
    filtersQuery["manufacturer.fullName"] = manufacturerFullName
      ? {
          $regex: new RegExp(
            '(^|((?![А-ЯA-z])[.,\\/#!$%\\^&\\*;"«»:{}=\\-_`~()])|\\s|\\b)' +
              manufacturerFullName +
              '(((?![А-ЯA-z])[.,\\/#!$%\\^&\\*;"«»:{}=\\-_`~()])|\\s|\\b|$)',
            "i"
          ),
        }
      : undefined;
    filtersQuery["product.fullName"] = productFullName
      ? {
          $regex: new RegExp(
            '(^|((?![А-ЯA-z])[.,\\/#!$%\\^&\\*;"«»:{}=\\-_`~()])|\\s|\\b)' +
              productFullName +
              '(((?![А-ЯA-z])[.,\\/#!$%\\^&\\*;"«»:{}=\\-_`~()])|\\s|\\b|$)',
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
            '(^|((?![А-ЯA-z])[.,\\/#!$%\\^&\\*;"«»:{}=\\-_`~()])|\\s|\\b)' +
              testingLabsFullName +
              '(((?![А-ЯA-z])[.,\\/#!$%\\^&\\*;"«»:{}=\\-_`~()])|\\s|\\b|$)',
            "i"
          ),
        }
      : undefined;
    filtersQuery["certificationAuthority.fullName"] =
      certificationAuthorityFullName
        ? {
            $regex: new RegExp(
              '(^|((?![А-ЯA-z])[.,\\/#!$%\\^&\\*;"«»:{}=\\-_`~()])|\\s|\\b)' +
                certificationAuthorityFullName +
                '(((?![А-ЯA-z])[.,\\/#!$%\\^&\\*;"«»:{}=\\-_`~()])|\\s|\\b|$)',
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
      ),
      null,
      { sort: { idDeclaration: -1 } }
    )
    .skip(skip)
    .limit(isShorted ? 25 : 50)
    // .sort({ declRegDate: -1, declEndDate:-1,idDeclaration:-1,idStatus:-1,number:-1})
    .lean();
  console.log(JSON.stringify(out));
  // .allowDiskUse(false)

  console.log("out");
  return out;
}
