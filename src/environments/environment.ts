
import { apiLocalHostURL, apiProductionURL } from "src/app/shared/data/api.data";
import { EnvironmentInterface } from "./environment.interface";

export const environment: EnvironmentInterface = {
  apiRootUrl: apiProductionURL,
  csrfURL: `${apiProductionURL}/sanctum/csrf-cookie`,

  // apiRootUrl: 'https://backend.c-pos.co.ke/api/',
  production: false,
}
