import { CertificatesFilters } from "../@types";
import { certificateDetailsModel } from "../models";

export async function findCertificates(filters: CertificatesFilters | null) {
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
      page,
    } = filters;

    filtersQuery.certRegDate = certRegDate ? { $regex: certRegDate } : undefined;
    filtersQuery.certEndDate = certEndDate ? { $regex: certEndDate } : undefined;
    filtersQuery.idCertificate = idCertificate ?? undefined;
    filtersQuery.idStatus = idStatus ?? undefined;
    filtersQuery.number = number ? { $regex: number } : undefined;
    filtersQuery["applicant.inn"] = inn ? { $regex: inn } : undefined;
    filtersQuery["applicant.shortName"] = applicantShortName ? { $regex: applicantShortName } : undefined;
    filtersQuery["applicant.fullName"] = applicantFullName ? { $regex: applicantFullName } : undefined;
    filtersQuery["manufacturer.shortName"] = manufacturerShortName ? { $regex: manufacturerShortName } : undefined;
    filtersQuery["manufacturer.fullName"] = manufacturerFullName ? { $regex: manufacturerFullName } : undefined;
    filtersQuery["product.fullName"] = productFullName ? { $regex: productFullName } : undefined;
    filtersQuery["testingLabs.regNumber"] = testingLabsRegNumber ? { $regex: testingLabsRegNumber } : undefined;
    filtersQuery["testingLabs.fullName"] = testingLabsFullName ? { $regex: testingLabsFullName } : undefined;
    filtersQuery["certificationAuthority.fullName"] = certificationAuthorityFullName ? { $regex: certificationAuthorityFullName } : undefined;
    filtersQuery["certificationAuthority.attestatRegNumber"] = certificationAuthorityAttestatRegNumber ? { $regex: certificationAuthorityAttestatRegNumber } : { $exists: true };
    filtersQuery["details.validationObjectType.name"] = validationObjectType ? { $regex: validationObjectType } : { $exists: true };
    filtersQuery["details.conformityDocType.name"] = conformityDocType ? { $regex: conformityDocType } : { $exists: true };
    filtersQuery["details.status.name"] = status ? { $regex: status } : undefined;
    filtersQuery["details.contactType.name"] = contactType ? { $regex: contactType } : undefined;
    filtersQuery["details.oksm.shortName"] = oksm ? { $regex: oksm } : undefined;
    filtersQuery["details.fiasAddrobj.offname"] = fiasAddrobj ? { $regex: fiasAddrobj } : undefined;
    filtersQuery["details.tnved.name"] = tnvedName ? { $regex: tnvedName } : undefined;
    filtersQuery["details.tnved.code"] = tnvedCode && tnvedCodePart === "1" ? { $regex: tnvedCode } : tnvedCode ? tnvedCode : undefined;
    filtersQuery["details.validationFormNormDoc.name"] = validationFormNormDocName ? { $regex: validationFormNormDocName } : undefined;
    filtersQuery["details.validationFormNormDoc.docNum"] = validationFormNormDocNum ? { $regex: validationFormNormDocNum } : undefined;
    filtersQuery["details.techregProductListEEU.name"] = techregProductListEEU ? { $regex: techregProductListEEU } : undefined;
  }

  const skip = (filters != null ? filters.page ?? 0 : 0) * 50;

  const out = await certificateDetailsModel
    .aggregate([
      {
        $lookup: {
          from: "certificate_decodes",
          localField: "idCertificate",
          foreignField: "idCert",
          as: "details",
        },
      },
      {
        $match: Object.fromEntries(Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)),
      },
      {
        $unwind: "$product.identifications",
      },
      {
        $project: {
          _id: 0,
          idCertificate: 1,
          Number: 1,
          idStatus: 1,
          certRegDate: 1,
          certEndDate: 1,
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
            idCert: "$details.idCert",
            applicantDocType: "$details.applicantDocType",
            status: "$details.status",
            tnveds: "$details.tnved",
            contactType: "$details.contactType",
            applicantType: "$details.applicantType",
            declarantType: "$details.declarantType",
            validationFormNormDoc: "$details.validationFormNormDoc",
            oksm: "$details.oksm",
          },
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: 50,
      },
      {
        $sort: {
          idCertificate: 1,
        },
      },
    ])
    .allowDiskUse(true)
    .exec();

  return out;
}
