import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.header("Authorization");
    const auth = this.authService.splitToken(authHeader);
    if (!auth || auth.type !== "bearer" || auth.token.length === 0) {
      throw new UnauthorizedException("No token found in Authorization header!");
    }
    try {
      const isAuthValid = this.authService.verifyAuth(auth.token);
      if (isAuthValid) {
        const githubToken = this.authService.getGithubToken(auth.token);
        const user = this.authService.getUser(auth.token);

        request.user = user;
        request.githubToken = githubToken;
        request.jwt = auth.token;
      }
      return isAuthValid;
    } catch (err) {
      return false;
    }
  }
}
