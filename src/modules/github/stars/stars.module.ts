import { Module, HttpModule } from "@nestjs/common";
import { TagModule } from "modules/tag/tag.module";
import { StarsController } from "./stars.controller";
import { StarsService } from "./stars.service";

@Module({
  imports: [HttpModule, TagModule],
  controllers: [StarsController],
  providers: [StarsService]
})
export class StarsModule {}
