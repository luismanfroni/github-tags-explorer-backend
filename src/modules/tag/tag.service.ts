import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "./tag.entity";
import { Repository, TableInheritance } from "typeorm";
import { UserDTO } from "modules/github/user/user.dto";
import { RepositoryDTO } from "modules/github/repository/repository.dto";
import { TagDTO } from "./tag.dto";
import { RepositoryService } from "modules/github/repository/repository.service";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly repo: Repository<Tag>,
    @Inject(forwardRef(() => RepositoryService))
    private readonly repositoryService: RepositoryService
  ) {}

  async countReposByTag(createdBy: string, tagName: string): Promise<number> {
    const count = await this.repo.count({ where: { createdBy, tagName } });
    return count;
  }
  async getReposByTag(
    token: string,
    createdBy: string,
    tagName: string,
    page: number,
    perPage: number
  ): Promise<RepositoryDTO[]> {
    const tags = await Promise.all(
      (
        await this.repo
          .find({ where: { createdBy, tagName } })
          .then((tags) => tags.map(TagDTO.fromEntity))
      ).map(async (tag) => {
        return await this.repositoryService.getRepository(
          token,
          createdBy,
          tag.repoAuthor,
          tag.repoName
        );
      })
    );
    return tags.slice((page - 1) * perPage, page * perPage);
  }

  async getDistinctTags(createdBy: string): Promise<string[]> {
    const tags = await this.repo
      .find({ where: { createdBy } })
      .then((tags) => tags.map((tag) => tag.tagName));
    return [...new Set(tags)];
  }

  async getAll(createdBy: string): Promise<TagDTO[]> {
    return await this.repo
      .find({ where: { createdBy } })
      .then((tags) => tags.map(TagDTO.fromEntity));
  }

  async getRepositoryTags(createdBy: string, repository: RepositoryDTO): Promise<TagDTO[]> {
    return await this.repo
      .find({
        where: { createdBy, repoAuthor: repository.owner, repoName: repository.name }
      })
      .then((tags) => tags.map(TagDTO.fromEntity));
  }

  async getRepositoryTagsAsString(createdBy: string, repository: RepositoryDTO): Promise<string[]> {
    return await this.repo
      .find({
        where: { createdBy, repoAuthor: repository.owner, repoName: repository.name }
      })
      .then((tags) => tags.map((tag) => tag.tagName));
  }
  async createTag(token: string, createdBy: string, tag: TagDTO) {
    await this.repositoryService.getRepository(token, createdBy, tag.repoAuthor, tag.repoName);
    const newTag = await this.repo.create();
    newTag.createdBy = createdBy;
    newTag.repoAuthor = tag.repoAuthor;
    newTag.repoName = tag.repoName;
    newTag.tagName = tag.tagName;
    await this.repo.save(newTag);
    return true;
  }
  async deleteTag(createdBy: string, tagDto: TagDTO) {
    const tag = await this.repo.findOne({
      where: {
        createdBy: createdBy,
        repoAuthor: tagDto.repoAuthor,
        repoName: tagDto.repoName,
        tagName: tagDto.tagName
      }
    });
    if (!tag) {
      throw new NotFoundException("Tag was not found!");
    }
    await this.repo.remove(tag);
    return true;
  }
  async deleteAllRepoTags(token: string, createdBy: string, tagDto: TagDTO) {
    await this.repositoryService.getRepository(
      token,
      createdBy,
      tagDto.repoAuthor,
      tagDto.repoName
    );
    const tags = await this.repo.find({
      where: {
        createdBy: createdBy,
        repoAuthor: tagDto.repoAuthor,
        repoName: tagDto.repoName
      }
    });
    if (!tags || tags.length === 0) {
      throw new NotFoundException("There is no tags with these parameters!");
    }
    await this.repo.remove(tags);
    return true;
  }
}
