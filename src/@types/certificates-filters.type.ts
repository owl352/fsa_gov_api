export type CertificatesFilters = {
  certRegDate?: string | null;
  certEndDate?: string | null;
  idCertificate?: number | null;
  idStatus?: number | null;
  number?: string | null;
  "applicant.inn"?: string | null;
  "applicant.shortName"?: string | null;
  "applicant.fullName"?: string | null;
  "manufacturer.shortName"?: string | null;
  "manufacturer.fullName"?: string | null;
  "product.fullName"?: string | null;
  "testingLabs.regNumber"?: string | null;
  "testingLabs.fullName"?: string | null;
  "certificationAuthority.fullName"?: string | null;
  "certificationAuthority.attestatRegNumber"?: string | null;
};
