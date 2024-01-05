import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { findDeclarations } from "./find-declarations.helper";
import {
  CertificatesDecodeFilters,
  CertificatesFilters,
  DeclarationDecodeFilters,
  DeclarationFilters,
} from "../@types";
import { findDeclarationDetails } from "./find-declaration-details.helper";
import { findCertificates } from "./find-certificates.helper";
import { findCertificateDetails } from "./find-certificate-details.helper";
import { RateLimiterMongo } from "rate-limiter-flexible";
import { findDeclarationDecode } from "./find-declaration-decode.helper";
import { findCertificateDecode } from "./find-certificate-decode.helper";

export function initExpress(mongo: any) {
  const opts = {
    storeClient: mongo.connection,
    points: 10, // Number of points
    duration: 1, // Per second(s)
    tableName: "test",
  };

  const rateLimiterMongo = new RateLimiterMongo(opts);

  const rateLimiterMiddleware = (req: any, res: any, next: any) => {
    rateLimiterMongo
      .consume(req.ip, 2)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(429).send("Too Many Requests");
      });
  };

  const app = express();
  app.use(rateLimiterMiddleware);
  app.use(
    cors({
      origin: "http://localhost:3000",
      optionsSuccessStatus: 200,
    })
  );
  app.use(bodyParser.json());
  app.use(bodyParser.raw());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.post("/declarations", async (req: Request, res: Response) => {
    try {
      let obj: DeclarationFilters | null = null;
      let objDecode: DeclarationDecodeFilters | null = null;
      if (req.body.filters != undefined) {
        obj = req.body.filters as DeclarationFilters;
      }
      if (req.body.decFilters != undefined) {
        objDecode = req.body.decFilters as DeclarationDecodeFilters;
      }

      res.send(
        await findDeclarations(
          obj != null
            ? {
                number: obj.number ?? null,
                "applicant.shortName": obj["applicant.shortName"] ?? null,
                "manufacturer.shortName": obj["manufacturer.shortName"] ?? null,
                "manufacturer.fullName": obj["manufacturer.fullName"] ?? null,
                "product.fullName": obj["product.fullName"] ?? null,
                "testingLabs.fullName": obj["testingLabs.fullName"] ?? null,
                "testingLabs.regNumber": obj["testingLabs.regNumber"] ?? null,
                "certificationAuthority.fullName":
                  obj["certificationAuthority.fullName"] ?? null,
                "certificationAuthority.attestatRegNumber":
                  obj["certificationAuthority.attestatRegNumber"] ?? null,
                declRegDate: obj.declRegDate ?? null,
                declEndDate: obj.declEndDate ?? null,
                idDeclaration: obj.idDeclaration ?? null,
                idStatus: obj.idStatus ?? null,
                "applicant.inn": obj["applicant.inn"] ?? null,
                "applicant.fullName": obj["applicant.fullName"] ?? null,
              }
            : null,
          objDecode != null
            ? {
                validationObjectType: objDecode.validationObjectType ?? null,
                conformityDocType: objDecode.conformityDocType ?? null,
                status: objDecode.status ?? null,
                contactType: objDecode.contactType ?? null,
                oksm: objDecode.oksm ?? null,
                fiasAddrobj: objDecode.fiasAddrobj ?? null,
                tnvedName: objDecode.tnvedName ?? null,
                tnvedCode: objDecode.tnvedCode ?? null,
                tnvedCodePart: objDecode.tnvedCodePart ?? null,
                validationFormNormDocName:
                  objDecode.validationFormNormDocName ?? null,
                validationFormNormDocNum:
                  objDecode.validationFormNormDocNum ?? null,
              }
            : null,
          req.body.page != undefined ? parseInt(req.body.page) : undefined
        )
      );
    } catch (error) {
      console.error(error);
      res.status(500);
      res.send("500");
    }
  });
  app.post("/declarationsDetails", async (req: Request, res: Response) => {
    try {
      if (req.body.id != null || req.body.id != undefined) {
        res.send(await findDeclarationDetails(parseInt(req.body.id)));
      } else {
        res.status(404);
        res.send("error");
      }
    } catch (error) {
      console.error(error);
      res.status(500);
      res.send("500");
    }
  });
  app.post("/certificates", async (req: Request, res: Response) => {
    try {
      let obj: CertificatesFilters | null = null;
      let objDecode: CertificatesDecodeFilters | null = null;
      if (req.body.filters != undefined) {
        obj = req.body.filters as CertificatesFilters;
      }
      if (req.body.decFilters != undefined) {
        objDecode = req.body.decFilters as CertificatesDecodeFilters;
      }
      res.send(
        await findCertificates(
          obj != null
            ? {
                certRegDate: obj.certRegDate ?? null,
                certEndDate: obj.certEndDate ?? null,
                idCertificate: obj.idCertificate ?? null,
                idStatus: obj.idStatus ?? null,
                number: obj.number,
                "applicant.inn": obj["applicant.inn"] ?? null,
                "manufacturer.shortName": obj["manufacturer.shortName"] ?? null,
                "manufacturer.fullName": obj["manufacturer.shortName"] ?? null,
                "product.fullName": obj["product.fullName"] ?? null,
                "applicant.shortName": obj["applicant.shortName"] ?? null,
                "applicant.fullName": obj["applicant.fullName"] ?? null,
                "testingLabs.regNumber": obj["testingLabs.regNumber"] ?? null,
                "testingLabs.fullName": obj["testingLabs.fullName"] ?? null,
                "certificationAuthority.fullName":
                  obj["certificationAuthority.fullName"] ?? null,
                "certificationAuthority.attestatRegNumber":
                  obj["certificationAuthority.attestatRegNumber"] ?? null,
              }
            : null,
          objDecode != null
            ? {
                validationObjectType: objDecode.validationObjectType ?? null,
                conformityDocType: objDecode.conformityDocType ?? null,
                status: objDecode.status ?? null,
                contactType: objDecode.contactType ?? null,
                oksm: objDecode.oksm ?? null,
                fiasAddrobj: objDecode.fiasAddrobj ?? null,
                tnvedName: objDecode.tnvedName ?? null,
                tnvedCode: objDecode.tnvedCode ?? null,
                tnvedCodePart: objDecode.tnvedCodePart ?? null,
                validationFormNormDocName:
                  objDecode.validationFormNormDocName ?? null,
                validationFormNormDocNum:
                  objDecode.validationFormNormDocNum ?? null,
                techregProductListEEU: objDecode.techregProductListEEU ?? null,
              }
            : null,
          req.body.page != undefined ? parseInt(req.body.page) : undefined
        )
      );
    } catch (error) {
      console.error(error);
      res.status(500);
      res.send("500");
    }
  });
  app.post("/certificatesDetails", async (req: Request, res: Response) => {
    try {
      if (req.body.id != null || req.body.id != undefined) {
        res.send(await findCertificateDetails(parseInt(req.body.id)));
      } else {
        res.status(404);
        res.send("error");
      }
    } catch (error) {
      console.error(error);
      res.status(500);
      res.send("500");
    }
  });

  app.post("/certsNDecl", async (req: Request, res: Response) => {
    try {
      let obj1: DeclarationFilters | null = null;
      let obj1Decode: DeclarationDecodeFilters | null = null;
      let obj2: CertificatesFilters | null = null;
      let obj2Decode: CertificatesDecodeFilters | null = null;
      if (req.body["declaration"].filters != undefined) {
        obj1 = req.body["declaration"].filters as DeclarationFilters;
      }
      if (req.body["declaration"].decFilters != undefined) {
        obj1Decode = req.body["declaration"]
          .decFilters as DeclarationDecodeFilters;
      }
      if (req.body["certificate"].filters != undefined) {
        obj2 = req.body["certificate"].filters as CertificatesFilters;
      }
      if (req.body["certificate"].decFilters != undefined) {
        obj2Decode = req.body["certificate"]
          .decFilters as CertificatesDecodeFilters;
      }
      const data: any = await Promise.all([
        await findDeclarations(
          obj1 != null
            ? {
                number: obj1.number ?? null,
                "applicant.shortName": obj1["applicant.shortName"] ?? null,
                "manufacturer.shortName":
                  obj1["manufacturer.shortName"] ?? null,
                "manufacturer.fullName": obj1["manufacturer.fullName"] ?? null,
                "product.fullName": obj1["product.fullName"] ?? null,
                "testingLabs.fullName": obj1["testingLabs.fullName"] ?? null,
                "testingLabs.regNumber": obj1["testingLabs.regNumber"] ?? null,
                "certificationAuthority.fullName":
                  obj1["certificationAuthority.fullName"] ?? null,
                "certificationAuthority.attestatRegNumber":
                  obj1["certificationAuthority.attestatRegNumber"] ?? null,
                declRegDate: obj1.declRegDate ?? null,
                declEndDate: obj1.declEndDate ?? null,
                idDeclaration: obj1.idDeclaration ?? null,
                idStatus: obj1.idStatus ?? null,
                "applicant.inn": obj1["applicant.inn"] ?? null,
                "applicant.fullName": obj1["applicant.fullName"] ?? null,
              }
            : null,
          obj1Decode != null
            ? {
                validationObjectType: obj1Decode.validationObjectType ?? null,
                conformityDocType: obj1Decode.conformityDocType ?? null,
                status: obj1Decode.status ?? null,
                contactType: obj1Decode.contactType ?? null,
                oksm: obj1Decode.oksm ?? null,
                fiasAddrobj: obj1Decode.fiasAddrobj ?? null,
                tnvedName: obj1Decode.tnvedName ?? null,
                tnvedCode: obj1Decode.tnvedCode ?? null,
                tnvedCodePart: obj1Decode.tnvedCodePart ?? null,
                validationFormNormDocName:
                  obj1Decode.validationFormNormDocName ?? null,
                validationFormNormDocNum:
                  obj1Decode.validationFormNormDocNum ?? null,
              }
            : null,
          req.body.page != undefined ? parseInt(req.body.page) : undefined
        ),
        await findCertificates(
          obj2 != null
            ? {
                certRegDate: obj2.certRegDate ?? null,
                certEndDate: obj2.certEndDate ?? null,
                idCertificate: obj2.idCertificate ?? null,
                idStatus: obj2.idStatus ?? null,
                number: obj2.number,
                "applicant.inn": obj2["applicant.inn"] ?? null,
                "manufacturer.shortName":
                  obj2["manufacturer.shortName"] ?? null,
                "manufacturer.fullName": obj2["manufacturer.shortName"] ?? null,
                "product.fullName": obj2["product.fullName"] ?? null,
                "applicant.shortName": obj2["applicant.shortName"] ?? null,
                "applicant.fullName": obj2["applicant.fullName"] ?? null,
                "testingLabs.regNumber": obj2["testingLabs.regNumber"] ?? null,
                "testingLabs.fullName": obj2["testingLabs.fullName"] ?? null,
                "certificationAuthority.fullName":
                  obj2["certificationAuthority.fullName"] ?? null,
                "certificationAuthority.attestatRegNumber":
                  obj2["certificationAuthority.attestatRegNumber"] ?? null,
              }
            : null,
          obj2Decode != null
            ? {
                validationObjectType: obj2Decode.validationObjectType ?? null,
                conformityDocType: obj2Decode.conformityDocType ?? null,
                status: obj2Decode.status ?? null,
                contactType: obj2Decode.contactType ?? null,
                oksm: obj2Decode.oksm ?? null,
                fiasAddrobj: obj2Decode.fiasAddrobj ?? null,
                tnvedName: obj2Decode.tnvedName ?? null,
                tnvedCode: obj2Decode.tnvedCode ?? null,
                tnvedCodePart: obj2Decode.tnvedCodePart ?? null,
                validationFormNormDocName:
                  obj2Decode.validationFormNormDocName ?? null,
                validationFormNormDocNum:
                  obj2Decode.validationFormNormDocNum ?? null,
                techregProductListEEU: obj2Decode.techregProductListEEU ?? null,
              }
            : null,
          req.body.page != undefined ? parseInt(req.body.page) : undefined
        ),
      ]);
      res.send(data);
    } catch (error) {
      console.error(error);
      res.status(500);
      res.send("500");
    }
  });

  app.post("/declDecode", async (req: Request, res: Response) => {
    try {
      res.send(await findDeclarationDecode(req.body.id));
    } catch (error) {
      console.error(error);
      res.status(500);
      res.send("500");
    }
  });

  app.post("/certDecode", async (req: Request, res: Response) => {
    try {
      res.send(await findCertificateDecode(parseInt(req.body.id)));
    } catch (error) {
      console.error(error);
      res.status(500);
      res.send("500");
    }
  });

  app.listen(process.env.PORT ?? 3000, () => {
    console.log("Server running!");
  });
  return app;
}
