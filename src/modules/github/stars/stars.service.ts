import { HttpService, Injectable } from "@nestjs/common";
import { ConfigurationService } from "config/config.service";
import { TagService } from "modules/tag/tag.service";
import { requestThrowNestException } from "utils/request";
import { RepositoryDTO } from "../repository/repository.dto";
import { UserDTO } from "../user/user.dto";

@Injectable()
export class StarsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigurationService,
    private readonly tagService: TagService
  ) {}

  public async getStarredRepositories(
    bearer: string,
    user: UserDTO,
    page: number,
    perPage: number
  ): Promise<RepositoryDTO[]> {
    const { apiEndpoint } = this.configService.getGithubApi();
    const starsEndpoint = `${apiEndpoint}/user/starred`;
    const query = `?per_page=${perPage}&page=${page}`;
    const starsRequest = await requestThrowNestException(
      this.httpService.get(starsEndpoint + query, {
        headers: { Accept: "application/json", Authorization: "bearer " + bearer }
      })
    );
    return await Promise.all(
      starsRequest.data.map(RepositoryDTO.fromRequest).map(async (repo) => {
        repo.tags = await this.tagService.getRepositoryTagsAsString(user.userName, repo);
        return repo;
      })
    );
  }
  private parseLinkHeader(link: string) {
    const [next, last] = link.split(",");
    const lastPage = last.split("page=")[2].split(">")[0];
    return lastPage;
  }
  async getStarsCount(token: string): Promise<number> {
    const { apiEndpoint } = this.configService.getGithubApi();
    const starsEndpoint = `${apiEndpoint}/user/starred`;
    const query = `?per_page=1`;
    const starsRequest = await requestThrowNestException(
      this.httpService.get(starsEndpoint + query, {
        headers: { Accept: "application/json", Authorization: "bearer " + token }
      })
    );
    const lastPage = this.parseLinkHeader(starsRequest.headers.link);
    return Number(lastPage);
  }
}
