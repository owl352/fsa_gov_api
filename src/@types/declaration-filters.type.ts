export type DeclarationFilters = {
  declRegDate?: string | null;
  declEndDate?: string | null;
  number?: string | null;
  idDeclaration?: number | null;
  idStatus?: number | null;
  "applicant.inn"?: string | null;
  "applicant.fullName"?: string | null;
  "applicant.shortName"?: string | null;
  "manufacturer.shortName"?: string | null;
  "manufacturer.fullName"?: string | null;
  "product.fullName"?: string | null;
  "testingLabs.fullName"?: string | null;
  "testingLabs.regNumber"?: string | null;
  "certificationAuthority.fullName"?: string | null;
  "certificationAuthority.attestatRegNumber"?: string | null;
};
