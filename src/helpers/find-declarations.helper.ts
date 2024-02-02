import { DeclarationFilters } from "../@types";
import { declarationDetailsModel } from "../models";

export async function findDeclarations(
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

    filtersQuery.declRegDate = declRegDate ? declRegDate : undefined;
    filtersQuery.declEndDate = declEndDate ? declEndDate : undefined;
    filtersQuery.number = number ? { $regex: number } : undefined;
    filtersQuery.idDeclaration = idDeclaration || undefined;
    filtersQuery.idStatus = idStatus || undefined;
    filtersQuery["applicant.inn"] = inn ? inn : undefined;
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
            new RegExp(`\\B${applicantShortName}\\B`, "gi"),
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
      ? productFullName
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
    filtersQuery["testingLabs.fullName"] = testingLabsFullName
      ? { $regex: testingLabsFullName }
      : undefined;
    filtersQuery["testingLabs.regNumber"] = testingLabsRegNumber
      ? { $regex: testingLabsRegNumber }
      : undefined;
    filtersQuery["certificationAuthority.fullName"] =
      certificationAuthorityFullName
        ? { $regex: certificationAuthorityFullName }
        : undefined;
    filtersQuery["certificationAuthority.attestatRegNumber"] =
      certificationAuthorityAttestatRegNumber
        ? { $regex: certificationAuthorityAttestatRegNumber }
        : undefined;
    filtersQuery["details.validationObjectType.name"] = validationObjectType
      ? { $regex: validationObjectType }
      : undefined;
    filtersQuery["details.conformityDocType.name"] = conformityDocType
      ? { $regex: conformityDocType }
      : undefined;
    filtersQuery["details.status.name"] = status
      ? { $regex: status }
      : undefined;
    filtersQuery["details.contactType.name"] = contactType
      ? { $regex: contactType }
      : undefined;
    filtersQuery["details.oksm.shortName"] = oksm
      ? { $regex: oksm }
      : undefined;
    filtersQuery["details.fiasAddrobj.offname"] = fiasAddrobj
      ? { $regex: fiasAddrobj }
      : undefined;
    filtersQuery["details.tnved.name"] = tnvedName
      ? { $regex: tnvedName }
      : undefined;
    filtersQuery["details.tnved.code"] =
      tnvedCodePart != undefined
        ? { $regex: `/^${tnvedCodePart}/` }
        : tnvedCode
        ? tnvedCode
        : undefined;
    filtersQuery["details.validationFormNormDoc.name"] =
      validationFormNormDocName
        ? { $regex: validationFormNormDocName }
        : undefined;
    filtersQuery["details.validationFormNormDoc.docNum"] =
      validationFormNormDocNum
        ? { $regex: validationFormNormDocNum }
        : undefined;
  }
  const skip = (filters != null ? filters.page ?? 0 : 0) * 50;
  console.log(
    Object.fromEntries(
      Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)
    )
  );

  const out = await declarationDetailsModel
    .aggregate([
      {
        $lookup: {
          from: "declaration_decodes",
          localField: "idDeclaration",
          foreignField: "idDecl",
          as: "details",
        },
      },
      {
        $sort: {
          idDeclaration: -1,
        },
      },
      {
        $match: Object.fromEntries(
          Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)
        ),
      },
      {
        $unwind: "$product.identifications",
      },

      {
        $project: {
          _id: 0,
          idDeclaration: 1,
          number: 1,
          idStatus: 1,
          status: "$details.status",
          declRegDate: 1,
          declEndDate: 1,
          "applicant.idLegalSubject": 1,
          "applicant.idEgrul": 1,
          "applicant.idApplicantType": 1,
          "applicant.idLegalSubjectType": 1,
          "applicant.fullName": 1,
          "applicant.shortName": 1,
          "applicant.inn": 1,
          "applicant.applicantDocType": "$details.applicantDocType",
          "manufacturer.idLegalSubject": 1,
          "manufacturer.idEgrul": 1,
          "manufacturer.idLegalSubjectType": 1,
          "manufacturer.fullName": 1,
          "manufacturer.shortName": 1,
          contactType: "$details.contactType",
          applicantType: "$details.applicantType",
          declarantType: "$details.declarantType",
          validationFormNormDocDecoded: "$details.validationFormNormDoc",
          oksm: "$details.oksm",
          product: {
            idProduct: "$product.idProduct",
            idProductOrigin: "$product.idProductOrigin",
            fullName: "$product.fullName",
            idTnveds: "$product.identifications.idTnveds",
            tnveds: "$details.tnved",
          },
          idTechnicalReglaments: 1,
          "testingLabs.regNumber": 1,
          "testingLabs.fullName": 1,
          "certificationAuthority.fullName": 1,
          "certificationAuthority.attestatRegNumber": 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: isShorted ? 25 : 50, // Получить 50 документов
      },
    ])
    .allowDiskUse(true)
    .exec();

  console.log("out");
  return out;
}
