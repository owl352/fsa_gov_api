import { declarationDetailsModel } from "../models";

export async function findDeclarationDetails(id: number) {
  const result = await declarationDetailsModel
    .aggregate([
      {
        $match: { idDeclaration: id },
      },
      {
        $lookup: {
          from: "declaration_decodes",
          localField: "idDeclaration",
          foreignField: "idDecl",
          as: "declarationDecode",
        },
      },
      {
        $unwind: "$declarationDecode",
      },
    ])
    .exec();

  return result;
}
