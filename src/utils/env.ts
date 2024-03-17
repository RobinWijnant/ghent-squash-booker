import { cleanEnv, email, str } from "envalid";

const env = cleanEnv(process.env, {
  USERNAME: email(),
  PASSWORD: str(),
  BASE_URL: str({ default: "https://sportterreinen.stad.gent" }),
  TZ: str({ default: "Europe/Brussels" }),
});

export default env;
