import { Module } from "@nestjs/common";
import { ConfigurationModule } from "./config/config.module";
import { AuthModule } from "modules/authentication/auth.module";

@Module({
  imports: [ConfigurationModule, AuthModule]
})
export class AppModule {}
