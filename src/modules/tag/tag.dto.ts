import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserDTO } from "modules/github/user/user.dto";
import { Tag } from "./tag.entity";

export class TagDTO implements Readonly<TagDTO> {
  @ApiProperty({ required: true })
  @IsString()
  repoName: string;

  @ApiProperty({ required: true })
  @IsString()
  repoAuthor: string;

  @ApiProperty({ required: true })
  @IsString()
  tagName: string;

  public static from(dto: Partial<TagDTO>) {
    const it = new TagDTO();
    it.repoAuthor = dto.repoAuthor;
    it.repoName = dto.repoName;
    it.tagName = dto.tagName;
    return it;
  }

  public static fromEntity(entity: Tag) {
    return TagDTO.from({
      repoAuthor: entity.repoAuthor,
      repoName: entity.repoName,
      tagName: entity.tagName
    });
  }

  public toEntity(createdBy: string) {
    const it = new Tag();
    it.createdBy = createdBy;
    it.repoAuthor = this.repoAuthor;
    it.repoName = this.repoName;
    it.tagName = this.tagName;
    return it;
  }
}
