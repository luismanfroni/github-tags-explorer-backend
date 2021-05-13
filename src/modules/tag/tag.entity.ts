import { Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "tag" })
export class Tag {
  @PrimaryColumn({ type: "varchar", length: 255 })
  repoName: string;

  @PrimaryColumn({ type: "varchar", length: 255 })
  repoAuthor: string;

  @PrimaryColumn({ type: "varchar", length: 255 })
  createdBy: string;

  @PrimaryColumn({ type: "varchar", length: 255 })
  tagName: string;
}
