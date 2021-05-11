import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserDTO } from "modules/github/user/user.dto";

export const JWTDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  return request.jwt;
});

export const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDTO => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);

export const GithubTokenDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.githubToken;
  }
);
