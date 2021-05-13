import { forwardRef, HttpService, Inject, Injectable } from "@nestjs/common";
import { ConfigurationService } from "config/config.service";
import { TagService } from "modules/tag/tag.service";
import { requestThrowNestException } from "utils/request";
import { RepositoryDTO } from "./repository.dto";

@Injectable()
export class RepositoryService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigurationService,
    @Inject(forwardRef(() => TagService))
    private readonly tagService: TagService
  ) {}
  async getRepository(
    githubToken: string,
    createdBy: string,
    author: string,
    repository: string
  ): Promise<RepositoryDTO> {
    const { apiEndpoint } = this.configService.getGithubApi();
    const repositoryEndpoint = `${apiEndpoint}/repos/${author}/${repository}`;
    const repositoryRequest = await requestThrowNestException(
      this.httpService.get(repositoryEndpoint, {
        headers: { Accept: "application/json", Authorization: `token ${githubToken}` }
      })
    );
    const repositoryDTO = RepositoryDTO.fromRequest(repositoryRequest.data);
    repositoryDTO.tags = await this.tagService.getRepositoryTagsAsString(createdBy, repositoryDTO);
    return repositoryDTO;
  }
}
