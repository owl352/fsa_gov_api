import { declarationDecodeModel } from "../models/declaration-decode.model";

export async function findDeclarationDecode(id: Number) {
  return await declarationDecodeModel.findOne({ idDecl: id }).lean();
}
