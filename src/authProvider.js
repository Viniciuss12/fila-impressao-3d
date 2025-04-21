export async function getAccessToken(instance, accounts) {
  const response = await instance.acquireTokenSilent({
    scopes: ["https://graph.microsoft.com/Sites.ReadWrite.All"],
    account: accounts[0]
  });
  return response.accessToken;
}
