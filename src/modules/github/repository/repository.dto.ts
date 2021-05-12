import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsArray } from "class-validator";

export class RepositoryDTO implements Readonly<RepositoryDTO> {
  @ApiProperty({ required: true })
  @IsString()
  owner: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsArray()
  topics: string[];

  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsString()
  license: string;

  @ApiProperty()
  @IsArray()
  tags: string[];

  public static from(dto: Partial<RepositoryDTO>) {
    const it = new RepositoryDTO();

    it.owner = dto.owner;
    it.name = dto.name;
    it.description = dto.description;
    it.topics = dto.topics;
    it.language = dto.language;
    it.license = dto.license;
    it.tags = dto.tags;

    return it;
  }

  public static fromRequest(data: any) {
    const it = new RepositoryDTO();

    it.owner = data.owner.login;
    it.name = data.name;
    it.description = data.description;
    it.topics = data.topics;
    it.language = data.language;
    it.license = data.license?.key;
    it.tags = [];

    return it;
  }
}
