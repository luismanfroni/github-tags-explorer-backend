import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { GithubTokenDecorator, UserDecorator } from "modules/authentication/auth.decorator";
import { AuthGuard } from "modules/authentication/auth.guard";
import { RepositoryDTO } from "../repository/repository.dto";
import { UserDTO } from "../user/user.dto";
// import { GithubOAuth2Guard } from "modules/github//oauth2.guard";
import { StarsService } from "./stars.service";

@Controller("stars")
@UseGuards(AuthGuard)
export class StarsController {
  constructor(private readonly starsService: StarsService) {}

  @Get("")
  async getIndex(
    @Query("page") page = 1,
    @Query("per_page") per_page = 12,
    @UserDecorator() user: UserDTO,
    @GithubTokenDecorator() token: string
  ): Promise<RepositoryDTO[]> {
    return this.starsService.getStarredRepositories(token, user, page, per_page);
  }
  @Get("count")
  async getCount(@GithubTokenDecorator() token: string): Promise<number> {
    return this.starsService.getStarsCount(token);
  }
}
