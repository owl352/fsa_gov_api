import { metricModel } from "../models";

export async function metricsMiddleware(
  req: any,
  res: any,
  next: any
): Promise<any> {
  const exist = await metricModel.findOne({ ip: req.socket.remoteAddress });
  if (!req.url.includes("favicon") && !req.url.includes("assets")) {
    if (exist) {
      let newLoginsData: Array<any> = exist.logins as Array<any>;
      if (newLoginsData.length > 500) {
        newLoginsData = [];
      }
      newLoginsData.push({
        time: new Date(),
        url: req.url,
        query: req.query,
        params: req.params,
        body: req.body,
        "user-agent": req.header("user-agent"),
        browser: req.header("sec-ch-ua"),
        platform: req.header("sec-ch-ua-platform"),
      });
      await metricModel.updateOne(
        { ip: req.socket.remoteAddress },
        { logins: newLoginsData }
      );
    } else {
      await metricModel.create({
        firstLogin: new Date(),
        ip: req.socket.remoteAddress,
        logins: [
          {
            time: new Date(),
            url: req.url,
            query: req.query,
            params: req.params,
            body: req.body,
            "user-agent": req.header("user-agent"),
            browser: req.header("sec-ch-ua"),
            platform: req.header("sec-ch-ua-platform"),
          },
        ],
      });
    }
  }
  await next();
}
