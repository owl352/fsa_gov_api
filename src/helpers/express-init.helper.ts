import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { findDeclarations } from "./find-declarations.helper";
import { CertificatesFilters, DeclarationFilters } from "../@types";
import { findDeclarationDetails } from "./find-declaration-details.helper";
import { findCertificates } from "./find-certificates.helper";
import { findCertificateDetails } from "./find-certificate-details.helper";
import { RateLimiterMongo } from "rate-limiter-flexible";
import { findDeclarationDecode } from "./find-declaration-decode.helper";
import { findCertificateDecode } from "./find-certificate-decode.helper";
import { findCertificatesBeta } from "./find-certificate.beta.helper";
import { findDeclarationsBeta } from "./find-declaration.beta.helper";

export function initExpress(mongo: any) {
  const rateLimiterMongo = new RateLimiterMongo({
    storeClient: mongo.connection,
    points: 10,
    duration: 1,
    tableName: "test",
  });

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
      origin: "*",
      optionsSuccessStatus: 200,
    })
  );
  app.use(bodyParser.json());
  app.use(bodyParser.raw());
  app.use(bodyParser.urlencoded({ extended: true }));

  const handleError = (res: Response, error: any) => {
    console.error(error);
    res.status(500).send("500");
  };

  app.post("/declarations", async (req: Request, res: Response) => {
    try {
      const filters: DeclarationFilters | null = req.body || null;
      res.send(await findDeclarationsBeta(filters));
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/declarationsDetails", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.body.id);
      if (!isNaN(id)) {
        res.send(await findDeclarationDetails(id));
      } else {
        res.status(404).send("error");
      }
    } catch (error) {
      handleError(res, error);
    }
  });

  // app.post("/certificates", async (req: Request, res: Response) => {
  //   try {
  //     const filters: CertificatesFilters | null = req.body || null;
  //     res.send(await findCertificates(filters));
  //   } catch (error) {
  //     handleError(res, error);
  //   }
  // });

  app.post("/certificates", async (req: Request, res: Response) => {
    try {
      const filters: CertificatesFilters | null = req.body || null;
      res.send(await findCertificatesBeta(filters));
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/certificatesDetails", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.body.id);
      if (!isNaN(id)) {
        res.send(await findCertificateDetails(id));
      } else {
        res.status(404).send("error");
      }
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/certsNDecl", async (req: Request, res: Response) => {
    try {
      const declarationFilters: DeclarationFilters | null =
        req.body.declaration || null;
      const certificateFilters: CertificatesFilters | null =
        req.body.certificate || null;
      const page = req.body.page ?? 0;

      const data =await Promise.all([
        findDeclarations({ ...declarationFilters, page },true),
        findCertificates({ ...certificateFilters, page },true),
      ]);

      res.send(data);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/declDecode", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.body.id);
      if (!isNaN(id)) {
        res.send(await findDeclarationDecode(id));
      } else {
        res.status(404).send("error");
      }
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/certDecode", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.body.id);
      if (!isNaN(id)) {
        res.send(await findCertificateDecode(id));
      } else {
        res.status(404).send("error");
      }
    } catch (error) {
      handleError(res, error);
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  return app;
}
