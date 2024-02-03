import { CertificatesFilters } from "../@types";
import { certificateDetailsModel } from "../models";

export async function findCertificates(
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
    filtersQuery["applicant.fullName"] = applicantFullName
      ? {
          $regex: new RegExp(
            `(?<!\w)(?<!\s)${applicantFullName}(?!\w)(?<!\s)|(?<!\w\S)${applicantFullName}(?!\w|\S)`,
            "i"
          ),
        }
      : undefined;
    filtersQuery["applicant.shortName"] = applicantShortName
      ? {
          $regex: new RegExp(
            `(?<!\w)(?<!\s)${applicantShortName}(?!\w)(?<!\s)|(?<!\w\S)${applicantShortName}(?!\w|\S)`,
            "i"
          ),
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
            `(?<!\w)(?<!\s)${manufacturerFullName}(?!\w)(?<!\s)|(?<!\w\S)${manufacturerFullName}(?!\w|\S)`,
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
      ? { $regex: testingLabsFullName }
      : undefined;
    filtersQuery["certificationAuthority.fullName"] =
      certificationAuthorityFullName
        ? { $regex: certificationAuthorityFullName }
        : undefined;
    filtersQuery["certificationAuthority.attestatRegNumber"] =
      certificationAuthorityAttestatRegNumber
        ? { $regex: certificationAuthorityAttestatRegNumber }
        : undefined;
    //! none in beta
    filtersQuery["details.validationObjectType.name"] = validationObjectType
      ? { $regex: validationObjectType }
      : undefined;
    //! none
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
    //! none
    filtersQuery["details.fiasAddrobj.offname"] = fiasAddrobj
      ? { $regex: fiasAddrobj }
      : undefined;
    filtersQuery["details.tnved.name"] = tnvedName
      ? { $regex: tnvedName }
      : undefined;
    filtersQuery["details.tnved.code"] = filters.tnvedCodePart
      ? { $regex: new RegExp(`^${filters.tnvedCodePart}`) }
      : filters.tnvedCode || undefined;
    filtersQuery["details.validationFormNormDoc.name"] =
      validationFormNormDocName
        ? { $regex: validationFormNormDocName }
        : undefined;
    filtersQuery["details.validationFormNormDoc.docNum"] =
      validationFormNormDocNum
        ? { $regex: validationFormNormDocNum }
        : undefined;
    //! none
    filtersQuery["details.techregProductListEEU.name"] = techregProductListEEU
      ? { $regex: techregProductListEEU }
      : undefined;
  }

  const skip = (filters?.page || 0) * 50;
  console.log(
    Object.fromEntries(
      Object.entries(filtersQuery).filter(([_, v]) => v !== undefined)
    )
  );
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
        $sort: {
          idCertificate: -1,
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
          idCertificate: 1,
          number: 1,
          idStatus: 1,
          status: "$details.status",
          certRegDate: 1,
          certEndDate: 1,
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
          oksm: "$details.oksm",
          product: {
            idProduct: "$product.idProduct",
            idProductOrigin: "$product.idProductOrigin",
            fullName: "$product.fullName",
            idTnveds: "$product.identifications.idTnveds",
            tnveds: "$details.tnved",
          },
          idTechnicalReglaments: 1,
          validationFormNormDocDecoded: "$details.validationFormNormDoc",
          "testingLabs.regNumber": 1,
          "testingLabs.fullName": 1,
          "certificationAuthority.fullName": 1,
          "certificationAuthority.attestatRegNumber": 1,
        },
      },
      {
        $unwind: "$status",
      },
      {
        $skip: skip,
      },
      {
        $limit: isShorted ? 25 : 50,
      },
    ])
    .allowDiskUse(true)
    .exec();
  console.log("out");
  return out;
}
