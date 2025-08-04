import { readFileSync } from "fs";
import { config as dotenvconfig } from "dotenv";
import { getEnvironment, Env } from "./environment";
import { merge } from "./merge";

const file = process.env.SERVER_CONFIG ?? "server.config.json";
const data = JSON.parse(readFileSync(file).toString());

dotenvconfig({
  path: getEnvironment().toString() + ".env",
});

try {
  const envFile = getEnvironment().toString() + "." + file;
  const envData = JSON.parse(readFileSync(envFile).toString());
  merge(data, envData);
} catch (error) {
  // do nothing - file doesn't exits or isn't readable
}

export const getConfig = (path: string, defaultVal: any = undefined): any => {
  const paths = path.split(":");
  let val = data;
  paths.forEach((p) => (val = val[p]));
  return val ?? defaultVal;
};
export const getSecret = (name: string) => {
  const secret = process.env[name];
  if (secret == undefined) {
    throw new Error(`Undefiled secret:${name}`);
  }
  return secret;
};

export { getEnvironment, Env };
