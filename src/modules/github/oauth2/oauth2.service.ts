import { Injectable, HttpService } from "@nestjs/common";
import { ConfigurationService } from "config/config.service";
import { normalizeRequest } from "utils/request";
import * as cryptoLib from "crypto";

@Injectable()
export class GithubOAuth2Service {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigurationService
  ) {}

  private generateRandomState(): string {
    return cryptoLib.randomBytes(20).toString("hex");
  }

  public generateAuthLink(): string {
    const { oauthEndpoint, scope } = this.configService.getGithubApi();
    const { client, callback } = this.configService.getGithubConfig();
    const randomState = this.generateRandomState();
    let urlQuery = "client_id=" + encodeURIComponent(client);
    urlQuery += "&scope=" + encodeURIComponent(scope);
    urlQuery += "&redirect_uri=" + encodeURIComponent(callback);
    urlQuery += "&state=" + encodeURIComponent(randomState);

    return `${oauthEndpoint}/authorize?${urlQuery}`;
  }

  public async exchangeRequest(code: string, state: string): Promise<string> {
    const { oauthEndpoint } = this.configService.getGithubApi();
    const exchangeCodeUrl = `${oauthEndpoint}/access_token`;
    const { client, secret, callback } = this.configService.getGithubConfig();

    const bearerRequest = await this.httpService
      .post(
        exchangeCodeUrl,
        {
          code,
          state,
          redirect_uri: callback,
          client_secret: secret,
          client_id: client
        },
        { headers: { Accept: "application/json" } }
      )
      .toPromise();

    return bearerRequest.data.access_token;
  }

  public async verifyAuthentication(token: string): Promise<boolean> {
    const { client, secret } = this.configService.getGithubConfig();
    const { apiEndpoint } = this.configService.getGithubApi();
    const verifyTokenUrl = `${apiEndpoint}/applications/${client}/token`;
    const verifyResponse = await normalizeRequest(
      this.httpService.post(
        verifyTokenUrl,
        { access_token: token },
        {
          headers: { Accept: "application/json" },
          auth: { username: client, password: secret }
        }
      )
    );
    return verifyResponse.status === 200;
  }

  public async revokeToken(token: string): Promise<boolean> {
    const { client, secret } = this.configService.getGithubConfig();
    const { apiEndpoint } = this.configService.getGithubApi();
    const revokeTokenUrl = `${apiEndpoint}/applications/${client}/token`;
    const revokeRequest = await normalizeRequest(
      this.httpService.delete(revokeTokenUrl, {
        headers: { Accept: "application/json" },
        data: { access_token: token },
        auth: { username: client, password: secret }
      })
    );
    return revokeRequest.status === 204;
  }
}
