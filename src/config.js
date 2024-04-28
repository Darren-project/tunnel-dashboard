const { CLIENT_ID, ISSUER, OKTA_TESTING_DISABLEHTTPSCHECK, USE_INTERACTION_CODE } = process.env

let USE_INTERACTION_CODE_FLOW = false;
if (USE_INTERACTION_CODE === 'true') {
  USE_INTERACTION_CODE_FLOW = true;
}

const BASENAME =  '';
const REDIRECT_URI = `${window.location.origin}${BASENAME}/login/callback`;

export default {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    useInteractionCodeFlow: USE_INTERACTION_CODE_FLOW,
    testing: {
      disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK
    }
  },
  app: {
    basename: BASENAME
  },
  api: {
    url: process.env.API_URL
  }
}
