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
      "validationObjectType.name": decodeFilters.validationObjectType
        ? { $regex: decodeFilters.validationObjectType }
        : {
            $exists: true,
          },
      "conformityDocType.name": decodeFilters.conformityDocType
        ? { $regex: decodeFilters.conformityDocType }
        : {
            $exists: true,
          },
      "status.name": decodeFilters.status
        ? { $regex: decodeFilters.status }
        : { $exists: true },
      "contactType.name": decodeFilters.contactType
        ? { $regex: decodeFilters.contactType }
        : { $exists: true },
      "oksm.shortName": decodeFilters.oksm
        ? { $regex: decodeFilters.oksm }
        : { $exists: true },
      "fiasAddrobj.offname": decodeFilters.fiasAddrobj
        ? { $regex: decodeFilters.fiasAddrobj }
        : { $exists: true },
      "tnved.name": decodeFilters.tnvedName
        ? { $regex: decodeFilters.tnvedName }
        : { $exists: true },
      "tnved.code": decodeFilters.tnvedCode
        ? decodeFilters.tnvedCodePart == "1"
          ? { $regex: decodeFilters.tnvedCode }
          : decodeFilters.tnvedCode
        : { $exists: true },
      "validationFormNormDoc.name": decodeFilters.validationFormNormDocName
        ? { $regex: decodeFilters.validationFormNormDocName }
        : { $exists: true },
      "validationFormNormDoc.docNum": decodeFilters.validationFormNormDocNum
        ? { $regex: decodeFilters.validationFormNormDocNum }
        : { $exists: true },
    };
  }
  if (decodeFilters != null) {
    out = await declarationDecodeModel
      .aggregate([
        {
          $match: decFiltQuery,
        },
        {
          $sort: { idDecl: 1 },
        },
        {
          $skip: 50 * (page ?? 0),
        },
        {
          $limit: 50,
        },
        {
          $lookup: {
            from: "declarationdetails",
            localField: "idDecl",
            foreignField: "declarationdetails",
            as: "details",
          },
        },
        {
          $unwind: "$details",
        },
        {
          $replaceRoot: { newRoot: "$details" },
        },
        {
          $match: {
            ...filtersQuery,
          },
        },
        {
          $project: {
            _id: 0,
            idDeclaration: 1,
            Number: 1,
            idStatus: 1,
            declRegDate: 1,
            declEndDate: 1,
            applicant: 1,
            manufacturer: 1,
            product: 1,
            idTechnicalReglaments: 1,
            testingLabs: 1,
          },
        },
      ])
      .allowDiskUse(true)
      .exec();
  } else if (filters != null) {
    out = await declarationDetailsModel
      .find(
        filtersQuery,
        {
          _id: 0,
          idDeclaration: 1,
          Number: 1,
          idStatus: 1,
          declRegDate: 1,
          declEndDate: 1,
          applicant: 1,
          manufacturer: 1,
          product: 1,
          idTechnicalReglaments: 1,
          testingLabs: 1,
        },
        {
          skip: 50 * (page ?? 0),
          sort: { idCertificate: 1 },
          limit: 50,
        }
      )
      .allowDiskUse(true)
      .lean();
  }
  console.log('out')
  return out;
}
