import { Module, HttpModule, Global } from "@nestjs/common";
import { GithubOAuth2Controller } from "./oauth2.controller";
import { GithubOAuth2Service } from "./oauth2.service";

@Global()
@Module({
  imports: [HttpModule],
  controllers: [GithubOAuth2Controller],
  providers: [GithubOAuth2Service],
  exports: [GithubOAuth2Service]
})
export class GithubOAuth2Module {}
