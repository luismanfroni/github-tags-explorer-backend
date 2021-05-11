import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UserDTO implements Readonly<UserDTO> {
  @ApiProperty()
  @IsString()
  userName: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  pictureUrl: string;

  public static from(dto: Partial<UserDTO>) {
    const it = new UserDTO();
    it.userName = dto.userName;
    it.name = dto.name;
    it.pictureUrl = dto.pictureUrl;
    return it;
  }
  public static fromRequest(data: any) {
    const it = new UserDTO();
    it.name = data["name"];
    it.userName = data["login"];
    it.pictureUrl = data["avatar_url"];
    return it;
  }
}
