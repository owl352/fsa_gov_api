import { metricModel } from "../models";

export function createMetricsCleaner() {
  setInterval(
    () => {
      metricModel.deleteMany({});
    },
    process.env.METRICS_TIMEOUT
      ? parseInt(process.env.METRICS_TIMEOUT?.toString())
      : 50400000
  );
}
