import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { CertificatesFilters, DeclarationFilters } from "../@types";
import { findDeclarationDetails } from "./find-declaration-details.helper";
import { findCertificateDetails } from "./find-certificate-details.helper";
import { RateLimiterMongo } from "rate-limiter-flexible";
import { findDeclarationDecode } from "./find-declaration-decode.helper";
import { findCertificateDecode } from "./find-certificate-decode.helper";
import { findCertificatesBeta } from "./find-certificate.beta.helper";
import { findDeclarationsBeta } from "./find-declaration.beta.helper";
import fs from "fs";
import https from "https";
import history from "connect-history-api-fallback";

var wwwRedirect = function (req: any, res: any, next: () => unknown) {
  if (req.get("host").indexOf("www.") === 0) {
    if (req.method === "GET" && !req.xhr) {
      return res.redirect(
        req.protocol + "://" + req.get("host").substring(4) + req.originalUrl
      );
    }
  }
  next();
};

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

  app.use(wwwRedirect);
  app.use(history({}));
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

  app.post("/api/declarations", async (req: Request, res: Response) => {
    try {
      const filters: DeclarationFilters | null = req.body || null;
      res.send(await findDeclarationsBeta(filters));
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/api/declarationsDetails", async (req: Request, res: Response) => {
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

  // app.post("/api/certificates", async (req: Request, res: Response) => {
  //   try {
  //     const filters: CertificatesFilters | null = req.body || null;
  //     res.send(await findCertificates(filters));
  //   } catch (error) {
  //     handleError(res, error);
  //   }
  // });

  app.post("/api/certificates", async (req: Request, res: Response) => {
    try {
      const filters: CertificatesFilters | null = req.body || null;
      res.send(await findCertificatesBeta(filters));
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/api/certificatesDetails", async (req: Request, res: Response) => {
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

  app.post("/api/certsNDecl", async (req: Request, res: Response) => {
    try {
      const declarationFilters: DeclarationFilters | null =
        req.body.declaration || null;
      const certificateFilters: CertificatesFilters | null =
        req.body.certificate || null;
      const page = req.body.page ?? 0;

      const data = await Promise.all([
        findDeclarationsBeta({ ...declarationFilters, page }, true),
        findCertificatesBeta({ ...certificateFilters, page }, true),
      ]);

      res.send(data);
    } catch (error) {
      handleError(res, error);
    }
  });

  app.post("/api/declDecode", async (req: Request, res: Response) => {
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

  app.post("/api/certDecode", async (req: Request, res: Response) => {
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

  if (process.env.FRONT_PATH) {
    console.log(process.env.FRONT_PATH);
    app.use(express.static(process.env.FRONT_PATH));
    app.get("/", function (req, res) {
      res.sendFile(process.env.FRONT_PATH + "index.html");
    });
  }

  app.get("*", function (req, res) {
    const host: string | undefined = req.get("host");
    if (host !== undefined) {
      res.redirect(req.protocol + "://" + host.substring(4));
    }
  });

  const PORT = 6325;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  if (
    fs.existsSync("sslcert/server.key") &&
    fs.existsSync("sslcert/server.crt")
  ) {
    var privateKey = fs.readFileSync("sslcert/server.key", "utf8");
    var certificate = fs.readFileSync("sslcert/server.crt", "utf8");

    var credentials = { key: privateKey, cert: certificate };
    var httpsServer = https.createServer(credentials, app);
    httpsServer.listen(process.env.PORT || 3000);
  }

  return app;
}
