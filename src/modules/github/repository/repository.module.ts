import { Module, HttpModule } from "@nestjs/common";
import { RepositoryController } from "./repository.controller";
import { RepositoryService } from "./repository.service";

@Module({
  imports: [HttpModule],
  controllers: [RepositoryController],
  providers: [RepositoryService]
})
export class RepositoryModule {}
