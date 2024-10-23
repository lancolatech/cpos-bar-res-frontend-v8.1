import { EnvironmentInterface } from './environment.interface';

// API URL FOR PRODUCTION
const apiLocalHostURL = 'https://backendapi.c-pos.co.ke';
const apiProductionURL = 'https://backendapi.c-pos.co.ke';
// const apiProductionURL = 'http://localhost:3333';
// export const apiProductionURL = 'https://api.c-pos.co.ke/api';

export const environment: EnvironmentInterface = {
  apiRootUrl: apiProductionURL,
  csrfURL: `${apiProductionURL}/sanctum/csrf-cookie`,

  // apiRootUrl: 'https://backend.c-pos.co.ke/api/',
  production: false,
};
