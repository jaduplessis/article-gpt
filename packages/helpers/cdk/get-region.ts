import { getArg } from "../getArg";

const defaultRegion = "ap-south-1";

export const getRegion = (): string =>
  getArg({
    cliArg: "region",
    processEnvName: "REGION",
    defaultValue: defaultRegion,
  });
