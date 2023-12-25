import { DeclarationFilters } from "../@types";
import { declarationDetailsModel } from "../models";

export async function finDeclarations(
  filters: DeclarationFilters,
  page?: number
) {
  console.log(filters);
  const out = await declarationDetailsModel
    .find(
      Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null)),
      {
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
      { skip: 50 * (page ?? 0) }
    )
    .limit(50)
    .lean();
  return out;
}
