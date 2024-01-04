import { declarationDecodeModel } from "../models";

export async function findDeclarationDecode(id: Number) {
  return await declarationDecodeModel.findOne({ idDecl: id }).lean();
}
