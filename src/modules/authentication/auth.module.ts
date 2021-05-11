import { Module, HttpModule, Global } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigurationModule } from "config/config.module";
import { ConfigurationService } from "config/config.service";
import { GithubOAuth2Module } from "modules/github/oauth2/oauth2.module";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "modules/github/user/user.service";

@Global()
@Module({
  imports: [
    HttpModule,
    GithubOAuth2Module,
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: async (configService: ConfigurationService) => ({
        secret: configService.getJWTSecret()
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
  exports: [AuthService]
})
export class AuthModule {}
