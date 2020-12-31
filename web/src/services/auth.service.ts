import * as Msal from '@azure/msal-browser'
import { PublicClientApplication, AuthenticationResult, Configuration, AccountInfo } from '@azure/msal-browser';

/**
 * Configuration class for @azure/msal-browser: 
 * https://azuread.github.io/microsoft-authentication-library-for-js/ref/msal-browser/modules/_src_config_configuration_.html
 */
const MSAL_CONFIG: Configuration = {
  auth: {
      clientId: "d6bdd3aa-996e-4170-b70f-0d318ea4d1da",
      authority: "https://emailtoselfch.b2clogin.com/emailtoselfch.onmicrosoft.com/B2C_1_ets_susi",
      knownAuthorities: [ "emailtoselfch.b2clogin.com" ],
      redirectUri: window.location.origin,
  },
  cache: {
      cacheLocation: "sessionStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};


export class AuthService {

  private app: PublicClientApplication;
  private account?: AccountInfo;

  constructor() {
    this.app = new PublicClientApplication(MSAL_CONFIG);
    this.app.handleRedirectPromise()
      .then(this.handleAuthResponse)
      .catch(console.error);
  }

  public login(): void {
    this.app.loginRedirect();
  }

  public logout(): void {
    this.app.logout();
  }

  public getLoggedInUserEmail(): string {
    return this.account ? this.account.homeAccountId : "";
  }

    /**
     * Handles the response from a popup or redirect. If response is null, will check if we have any accounts and attempt to sign in.
     * @param response 
     */
  private handleAuthResponse(response: AuthenticationResult | null) {
      if (response !== null) {
          this.account = response.account;
      } else {
          this.account = this.getAccount();
      }
  }

  /**
     * Calls getAllAccounts and determines the correct account to sign into, currently defaults to first account found in cache.
     * TODO: Add account chooser code
     * 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
  private getAccount(): AccountInfo | undefined {
    // need to call getAccount here?
    const currentAccounts = this.app.getAllAccounts();
    if (currentAccounts === null) {
        console.log("No accounts detected");
        return;
    }

    if (currentAccounts.length > 1) {
        // Add choose account code here
        console.log("Multiple accounts detected, need to add choose account code.");
        return currentAccounts[0];
    } else if (currentAccounts.length === 1) {
        return currentAccounts[0];
    }
  }
}

export default new AuthService();