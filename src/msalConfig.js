export const msalConfig = {
  auth: {
    clientId: "375e806e-8876-4de3-ac21-d6c2d725ca35", // substitua se diferente
    authority: "https://login.microsoftonline.com/ab418361-f6c6-4534-b75d-e2d7fcfe5d44", // tenant ID
    redirectUri: "http://localhost:3000"
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false
  }
};

export const loginRequest = {
  scopes: ["User.Read", "https://graph.microsoft.com/Sites.Read.All"]
};
