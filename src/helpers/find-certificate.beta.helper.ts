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
            $language: "ru",
            $diacriticSensitive: false,
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
        { sort: { idCertificate: -1 } }
      )
      .skip(skip)
      .limit(isShorted ? 25 : 50)
      .lean();

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
