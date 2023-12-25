import { declarationDetailsModel } from "../models";

export async function findDeclarationDetails(id: number) {
  const out = await declarationDetailsModel
    .findOne({ idDeclaration: id })
    .lean();
  return out;
}
