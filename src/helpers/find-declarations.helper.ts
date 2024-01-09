import { DeclarationDecodeFilters, DeclarationFilters } from "../@types";
import { declarationDecodeModel, declarationDetailsModel } from "../models";

export async function findDeclarations(
  filters: DeclarationFilters | null,
  decodeFilters: DeclarationDecodeFilters | null,
  page?: number
) {
  let out: any[] = [];
  let filtersQuery: any = {};
  let decFiltQuery: any = {};
  if (filters != null) {
    filtersQuery = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null)
    );
  }
  if (decodeFilters != null) {
    decFiltQuery = {
      "details.validationObjectType.name": decodeFilters.validationObjectType
        ? { $regex: decodeFilters.validationObjectType }
        : {
            $exists: true,
          },
      "details.conformityDocType.name": decodeFilters.conformityDocType
        ? { $regex: decodeFilters.conformityDocType }
        : {
            $exists: true,
          },
      "details.status.name": decodeFilters.status
        ? { $regex: decodeFilters.status }
        : { $exists: true },
      "details.contactType.name": decodeFilters.contactType
        ? { $regex: decodeFilters.contactType }
        : { $exists: true },
      "details.oksm.shortName": decodeFilters.oksm
        ? { $regex: decodeFilters.oksm }
        : { $exists: true },
      "details.fiasAddrobj.offname": decodeFilters.fiasAddrobj
        ? { $regex: decodeFilters.fiasAddrobj }
        : { $exists: true },
      "details.tnved.name": decodeFilters.tnvedName
        ? { $regex: decodeFilters.tnvedName }
        : { $exists: true },
      "details.tnved.code": decodeFilters.tnvedCode
        ? decodeFilters.tnvedCodePart == "1"
          ? { $regex: decodeFilters.tnvedCode }
          : decodeFilters.tnvedCode
        : { $exists: true },
      "details.validationFormNormDoc.name":
        decodeFilters.validationFormNormDocName
          ? { $regex: decodeFilters.validationFormNormDocName }
          : { $exists: true },
      "details.validationFormNormDoc.docNum":
        decodeFilters.validationFormNormDocNum
          ? { $regex: decodeFilters.validationFormNormDocNum }
          : { $exists: true },
    };
  }
  out = await declarationDetailsModel
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
        $match: {
          ...decFiltQuery,
          ...filtersQuery,
        },
      },
      {
        $unwind: "$product.identifications",
      },
      {
        $project: {
          _id: 0,
          idDeclaration: 1,
          Number: 1,
          idStatus: 1,
          declRegDate: 1,
          declEndDate: 1,
          "applicant.idLegalSubject": 1,
          "applicant.idEgrul": 1,
          "applicant.idApplicantType": 1,
          "applicant.idLegalSubjectType": 1,
          "applicant.fullName": 1,
          "applicant.shortName": 1,
          "applicant.inn": 1,
          "manufacturer.idLegalSubject": 1,
          "manufacturer.idEgrul": 1,
          "manufacturer.idLegalSubjectType": 1,
          "manufacturer.fullName": 1,
          "manufacturer.shortName": 1,
          product: {
            idProduct: "$product.idProduct",
            idProductOrigin: "$product.idProductOrigin",
            fullName: "$product.fullName",
            idTnveds: "$product.identifications.idTnveds",
          },
          idTechnicalReglaments: 1,
          "testingLabs.regNumber": 1,
          "testingLabs.fullName": 1,
          "certificationAuthority.fullName": 1,
          "certificationAuthority.attestatRegNumber": 1,
          details: {
            id: "$details.idDecl",
            applicantDocType:"$details.applicantDocType",
            status:"$details.status",
            tnveds:"$details.tnved",
            contactType:"$details.contactType",
            applicantType:"$details.applicantType",
            declarantType:"$details.declarantType",
            validationFormNormDoc:"$details.validationFormNormDoc",
            oksm:"$details.oksm",
          },
        },
      },
      {
        $limit: 50, // Получить 50 документов
      },
      {
        $sort: {
          idDeclaration: 1,
        },
      },
    ])
    .allowDiskUse(true)
    .exec();
  console.log("out");
  return out;
}
