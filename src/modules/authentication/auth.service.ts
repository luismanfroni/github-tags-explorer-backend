import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GithubOAuth2Service } from "modules/github/oauth2/oauth2.service";
import { UserService } from "modules/github/user/user.service";
import { UserDTO } from "modules/github/user/user.dto";
import { JwtDTO } from "./jwt.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly githubAuthService: GithubOAuth2Service,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}
  splitToken(auth: string): { type: string; token: string } {
    if (!auth) return null;
    const split = auth.split(" ");
    if (split.length == 2) {
      return {
        type: split[0].trim().toLowerCase(),
        token: split[1].trim()
      };
    }
    return null;
  }
  async generateToken(githubBearer: string): Promise<string> {
    const user = await this.userService.getUser(githubBearer);
    const jwtObject: JwtDTO = {
      user,
      githubToken: githubBearer
    };
    const jwtToken = this.jwtService.sign(jwtObject);
    return jwtToken;
  }
  getGithubToken(jwtToken: string): string {
    const decodedJwt = this.jwtService.decode(jwtToken);
    const jwtObject: JwtDTO = JwtDTO.from(decodedJwt as Partial<JwtDTO>);
    return jwtObject.githubToken;
  }
  getUser(jwtToken: string): UserDTO {
    const decodedJwt = this.jwtService.decode(jwtToken);
    const jwtObject: JwtDTO = JwtDTO.from(decodedJwt as Partial<JwtDTO>);
    return jwtObject.user;
  }
  verifyAuth(jwtToken: string): boolean {
    try {
      // Will throw an error if token is invalid.
      this.jwtService.verify(jwtToken);
      return true;
    } catch (err) {
      return false;
    }
  }
  async verifyGithubAuth(jwtToken: string): Promise<boolean> {
    const githubBearer = this.getGithubToken(jwtToken);
    const isValid = await this.githubAuthService.verifyAuthentication(githubBearer);
    return isValid;
  }
}
