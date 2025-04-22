const msalConfig = {
  auth: {
    clientId: "375e806e-8876-4de3-ac21-d6c2d725ca35", // seu clientId
    authority: "https://login.microsoftonline.com/ab418361-f6c6-4534-b75d-e2d7fcfe5d44", // seu tenantId
    redirectUri: "https://fila-impressao-3d.onrender.com", // deve ser exatamente igual ao da Azure
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export default msalConfig;
