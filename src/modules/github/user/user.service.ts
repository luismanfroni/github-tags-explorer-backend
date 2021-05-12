import { HttpService, Injectable } from "@nestjs/common";
import { ConfigurationService } from "config/config.service";
import { requestThrowNestException } from "utils/request";
import { UserDTO } from "./user.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigurationService
  ) {}

  public async getUser(githubToken: string): Promise<UserDTO> {
    const userEndpoint = this.configService.getGithubApi().apiEndpoint + "/user";
    const userRequest = await requestThrowNestException(
      this.httpService.get(userEndpoint, {
        headers: {
          Accept: "application/json",
          Authorization: "token " + githubToken
        }
      })
    );
    const user = UserDTO.fromRequest(userRequest.data);
    return user;
  }
}
