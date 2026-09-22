import "dotenv/config";
import fs from "fs";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const versionData = {
  version: process.env.VITE_IMAGE_VERSION || packageJson.version || "0.0.0",
  env: process.env.VITE_ENV || "unknown",
  date: getLocalISOWithOffset(),
  port: process.env.VITE_DOCKER_PORT || "unknown",
  appEnterprise: process.env.VITE_ENTERPRISE_NAME || "unknown",
  platform: process.env.VITE_PLATFORM || "unknown"
};

fs.writeFileSync(
  "./public/version.json",
  JSON.stringify(versionData, null, 2)
);

function getLocalISOWithOffset() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(now);

  const get = (type) => parts.find(p => p.type === type).value;

  const year = get("year");
  const month = get("month");
  const day = get("day");
  const hour = get("hour");
  const minute = get("minute");
  const second = get("second");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

console.log("✔ version.json gerado");