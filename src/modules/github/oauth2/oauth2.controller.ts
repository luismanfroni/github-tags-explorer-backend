import { Controller, Get, Header, Query, Redirect } from "@nestjs/common";
import { GithubOAuth2Service } from "./oauth2.service";

@Controller("github")
export class GithubOAuth2Controller {
  constructor(private readonly githubOAuth2Service: GithubOAuth2Service) {}

  @Get("auth")
  @Redirect()
  getAuth() {
    const authUri = this.githubOAuth2Service.generateAuthLink();
    return { url: authUri };
  }

  @Get("callback")
  @Redirect()
  @Header("Content-Type", "application/json")
  async getCallback(@Query("code") code: string, @Query("state") state: string) {
    const bearer = await this.githubOAuth2Service.exchangeRequest(code, state);
    const url = "/api/auth?bearer=" + encodeURIComponent(bearer);
    return { url };
  }
}
