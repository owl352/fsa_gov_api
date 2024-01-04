import { CertificatesDecodeFilters, CertificatesFilters } from "../@types";
import { certificateDecodeModel } from "../models";
import { certificateDetailsModel } from "../models";

export async function findCertificates(
  filters: CertificatesFilters | null,
  decodeFilters: CertificatesDecodeFilters | null,
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
      "techregProductListEEU.name": decodeFilters.techregProductListEEU
        ? { $regex: decodeFilters.techregProductListEEU }
        : { $exists: true },
    };
  }
  if (decodeFilters != null) {
    out = await certificateDecodeModel
      .aggregate([
        {
          $match: decFiltQuery,
        },
        {
          $sort: { idCert: 1 },
        },
        {
          $skip: 50 * (page ?? 0),
        },
        {
          $limit: 50,
        },
        {
          $lookup: {
            from: "certificatedetails",
            localField: "idCert",
            foreignField: "idCertificate",
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
            idCertificate: 1,
            number: 1,
            idStatus: 1,
            certRegDate: 1,
            certEndDate: 1,
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
    out = await certificateDetailsModel
      .find(
        filtersQuery,
        {
          _id: 0,
          idCertificate: 1,
          number: 1,
          idStatus: 1,
          certRegDate: 1,
          certEndDate: 1,
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
  return out;
}
