import { Module } from "@nestjs/common";
import { ConfigurationModule } from "./config/config.module";
import { AuthModule } from "modules/authentication/auth.module";
import { GithubModule } from "modules/github/github.module";

@Module({
  imports: [ConfigurationModule, GithubModule, AuthModule]
})
export class AppModule {}
