import { UserDTO } from "modules/github/user/user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class JwtDTO implements Readonly<JwtDTO> {
  @ApiProperty({ required: true })
  @IsString()
  githubToken: string;

  @ApiProperty({ required: true })
  user: UserDTO;

  public static from(dto: Partial<JwtDTO>) {
    const it = new JwtDTO();
    it.githubToken = dto.githubToken;
    it.user = dto.user;
    return it;
  }
}
