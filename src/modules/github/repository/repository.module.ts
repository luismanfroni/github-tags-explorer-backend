import { Module, HttpModule } from "@nestjs/common";
import { TagModule } from "modules/tag/tag.module";
import { RepositoryController } from "./repository.controller";
import { RepositoryService } from "./repository.service";

@Module({
  imports: [HttpModule, TagModule],
  controllers: [RepositoryController],
  providers: [RepositoryService]
})
export class RepositoryModule {}
