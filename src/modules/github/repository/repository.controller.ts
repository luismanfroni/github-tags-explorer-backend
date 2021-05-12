import {
  NotFoundException,
  BadRequestException,
  Controller,
  Get,
  Param,
  UseGuards
} from "@nestjs/common";
import { GithubTokenDecorator, UserDecorator } from "modules/authentication/auth.decorator";
import { AuthGuard } from "modules/authentication/auth.guard";
import { UserDTO } from "../user/user.dto";
import { RepositoryDTO } from "./repository.dto";
import { RepositoryService } from "./repository.service";

@Controller("repository")
@UseGuards(AuthGuard)
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Get(":author/:repository")
  async getIndex(
    @GithubTokenDecorator() token: string,
    @UserDecorator() user: UserDTO,
    @Param() params
  ): Promise<RepositoryDTO> {
    if (!params.author || !params.repository) {
      throw new BadRequestException("Author or repository parameter is invalid!");
    }
    const repository = await this.repositoryService.getRepository(
      token,
      user.userName,
      params.author,
      params.repository
    );
    if (!repository) {
      throw new NotFoundException(
        `Couldn't find the repository ${params.author}/${params.repository}`
      );
    }
    return repository;
  }
}
