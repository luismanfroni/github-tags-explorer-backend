import {
  Controller,
  Get,
  Delete,
  Query,
  Res,
  UseGuards,
  BadRequestException,
  UnauthorizedException
} from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "./auth.guard";
import { GithubTokenDecorator } from "./auth.decorator";
import { AuthService } from "./auth.service";
import { ConfigurationService } from "config/config.service";
import { GithubOAuth2Service } from "modules/github/oauth2/oauth2.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly configService: ConfigurationService,
    private readonly authService: AuthService,
    private readonly githubAuthService: GithubOAuth2Service
  ) {}

  @Get("")
  async getAuth(@Res() response: Response, @Query("bearer") bearer?: string) {
    if (!bearer) {
      throw new UnauthorizedException("No github bearer token was informed!");
    }
    const isBearerValid = await this.githubAuthService.verifyAuthentication(bearer);
    if (!isBearerValid) {
      throw new UnauthorizedException("Invalid github bearer token!");
    }

    const token = await this.authService.generateToken(bearer);

    const redirectUrl =
      this.configService.getFrontendUrl() + "/auth?session=" + encodeURIComponent(token);

    return response.redirect(redirectUrl);
  }

  @Get("check")
  @UseGuards(AuthGuard)
  getCheck() {
    return "success";
  }

  @Get("checkBearer")
  @UseGuards(AuthGuard)
  getCheckBearer(@GithubTokenDecorator() token) {
    const isBearerValid = this.githubAuthService.verifyAuthentication(token);
    if (!isBearerValid) {
      throw new UnauthorizedException("Invalid github bearer token!");
    }
    return "success";
  }

  @Delete("")
  @UseGuards(AuthGuard)
  async deleteAuth(@GithubTokenDecorator() token) {
    const revoked = await this.githubAuthService.revokeToken(token);
    if (!revoked) throw new BadRequestException("Couldn't revoke token! Try again later");
    return "success";
  }
}
