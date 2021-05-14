import { Module } from "@nestjs/common";
import { RepositoryModule } from "./repository/repository.module";
import { StarsModule } from "./stars/stars.module";

@Module({
  imports: [RepositoryModule, StarsModule]
})
export class GithubModule {}
