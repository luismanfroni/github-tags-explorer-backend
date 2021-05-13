import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards
} from "@nestjs/common";
import { GithubTokenDecorator, UserDecorator } from "modules/authentication/auth.decorator";
import { AuthGuard } from "modules/authentication/auth.guard";
import { RepositoryDTO } from "modules/github/repository/repository.dto";
import { UserDTO } from "modules/github/user/user.dto";
import { TagDTO } from "./tag.dto";
import { TagService } from "./tag.service";

@Controller("tag")
@UseGuards(AuthGuard)
export class TagController {
  constructor(private readonly tagsService: TagService) {}

  @Get("")
  async getTags(@UserDecorator() user: UserDTO): Promise<string[]> {
    return await this.tagsService.getDistinctTags(user.userName);
  }

  @Get(":tag/count")
  async getCountReposWithTag(@UserDecorator() user: UserDTO, @Param() params): Promise<number> {
    const tag = params.tag;
    if (!tag) {
      throw new BadRequestException("Invalid tag!");
    }
    return await this.tagsService.countReposByTag(user.userName, tag);
  }

  @Get(":tag")
  async getReposWithTag(
    @GithubTokenDecorator() token: string,
    @UserDecorator() user: UserDTO,
    @Query("page") page = 1,
    @Query("per_page") per_page = 12,
    @Param() params
  ): Promise<RepositoryDTO[]> {
    const tag = params.tag;
    if (!tag) {
      throw new BadRequestException("Invalid tag!");
    }
    return await this.tagsService.getReposByTag(token, user.userName, tag, page, per_page);
  }

  @Put(":author/:repo/:tag")
  async putRepoTag(
    @GithubTokenDecorator() token: string,
    @UserDecorator() user: UserDTO,
    @Param() params
  ) {
    const author = params.author;
    const repo = params.repo;
    const tag = params.tag;
    if (!tag || !repo || !author) {
      throw new BadRequestException("Invalid author/repo/tag!");
    }
    const tagDto = new TagDTO();
    tagDto.tagName = tag;
    tagDto.repoAuthor = author;
    tagDto.repoName = repo;
    await this.tagsService.createTag(token, user.userName, tagDto);
    return "success";
  }

  @Delete(":author/:repo")
  async deleteAllRepoTags(
    @GithubTokenDecorator() token: string,
    @UserDecorator() user: UserDTO,
    @Param() params
  ) {
    const author = params.author;
    const repo = params.repo;
    if (!repo || !author) {
      throw new BadRequestException("Invalid author/repo!");
    }
    const tagDto = new TagDTO();
    tagDto.repoName = repo;
    tagDto.repoAuthor = author;
    await this.tagsService.deleteAllRepoTags(token, user.userName, tagDto);
    return "success";
  }

  @Delete(":author/:repo/:tag")
  async deleteRepoTag(
    @GithubTokenDecorator() token: string,
    @UserDecorator() user: UserDTO,
    @Param() params
  ) {
    const author = params.author;
    const repo = params.repo;
    const tag = params.tag;
    if (!tag || !repo || !author) {
      throw new BadRequestException("Invalid author/repo/tag!");
    }
    const tagDto = new TagDTO();
    tagDto.tagName = tag;
    tagDto.repoName = repo;
    tagDto.repoAuthor = author;
    await this.tagsService.deleteTag(user.userName, tagDto);
    return "success";
  }
}
