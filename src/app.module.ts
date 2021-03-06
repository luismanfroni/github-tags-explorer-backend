import { Module } from "@nestjs/common";
import { ConfigurationModule } from "./config/config.module";
import { AuthModule } from "modules/authentication/auth.module";
import { GithubModule } from "modules/github/github.module";
import { TagModule } from "modules/tag/tag.module";

@Module({
  imports: [ConfigurationModule, TagModule, GithubModule, AuthModule]
})
export class AppModule {}
