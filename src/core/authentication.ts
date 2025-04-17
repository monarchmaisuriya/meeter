// For more information about this file see https://dove.feathersjs.com/guides/cli/authentication.html
import { AuthenticationService, JWTStrategy } from "@feathersjs/authentication"
import { oauth, OAuthProfile, OAuthStrategy } from "@feathersjs/authentication-oauth"
import type { Application } from "../declarations"

declare module "../declarations" {
  interface ServiceTypes {
    authentication: AuthenticationService
  }
}

class GoogleStrategy extends OAuthStrategy {
  async getEntityData(profile: OAuthProfile, _existingEntity: any, _params: any) {
    const baseData = await super.getEntityData(profile, _existingEntity, _params)
    const sessionData = _params?.state?.grant?.response

    if (profile && baseData && sessionData) {
      return {
        ...baseData,
        email: profile.email,
        sub: profile.sub ?? profile.id ?? "",
        idToken: sessionData.id_token,
        googleAccessToken: sessionData.access_token,
        googleRefreshToken: sessionData.refresh_token,
        googleExpiryDate: sessionData.raw?.expires_in
      }
    } else {
      return {}
    }
  }
}

export const authentication = (app: Application) => {
  const authentication = new AuthenticationService(app)

  authentication.register("jwt", new JWTStrategy())
  authentication.register("google", new GoogleStrategy())

  app.use("authentication", authentication)
  app.configure(oauth())
}
