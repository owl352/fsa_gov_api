import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { finDeclarations } from "./find-declarations.helper";
import { CertificatesFilters, DeclarationFilters } from "../@types";
import { isAutoAccessorPropertyDeclaration } from "typescript";
import { findDeclarationDetails } from "./find-declaration-details.helper";
import { findCertificates } from "./find-certificates.helper";
import { findCertificateDetails } from "./find-certificate-details.helper";

export function initExpress() {
  const app = express();

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
      const obj: DeclarationFilters = req.body as DeclarationFilters;
      res.send(
        await finDeclarations(
          {
            declRegDate: obj.declRegDate ?? null,
            declEndDate: obj.declEndDate ?? null,
            idDeclaration: obj.idDeclaration ?? null,
            "applicant.inn": obj["applicant.inn"] ?? null,
            "applicant.fullName": obj["applicant.fullName"] ?? null,
          },
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
      const obj: CertificatesFilters = req.body as CertificatesFilters;
      console.log(obj);
      res.send(
        await findCertificates(
          {
            certRegDate: obj.certRegDate ?? null,
            certEndDate: obj.certEndDate ?? null,
            idCertificate: obj.idCertificate ?? null,
            idStatus: obj.idStatus ?? null,
            "applicant.fullName": obj["applicant.fullName"] ?? null,
            "testingLabs.regNumber": obj["testingLabs.regNumber"] ?? null,
          },
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
      const obj1: DeclarationFilters = req.body[0] as DeclarationFilters;
      const obj2: CertificatesFilters = req.body[1] as CertificatesFilters;
      const data: any = await Promise.all([
        finDeclarations(
          {
            declRegDate: obj1.declRegDate ?? null,
            declEndDate: obj1.declEndDate ?? null,
            idDeclaration: obj1.idDeclaration ?? null,
            "applicant.inn": obj1["applicant.inn"] ?? null,
            "applicant.fullName": obj1["applicant.fullName"] ?? null,
          },
          req.body.page != undefined ? parseInt(req.body.page) : undefined
        ),
        findCertificates(
          {
            certRegDate: obj2.certRegDate ?? null,
            certEndDate: obj2.certEndDate ?? null,
            idCertificate: obj2.idCertificate ?? null,
            idStatus: obj2.idStatus ?? null,
            "applicant.fullName": obj2["applicant.fullName"] ?? null,
            "testingLabs.regNumber": obj2["testingLabs.regNumber"] ?? null,
          },
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

  app.listen(process.env.PORT ?? 3000, () => {
    console.log("Server running!");
  });
  return app;
}
