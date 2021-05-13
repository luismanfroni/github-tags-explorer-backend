import { forwardRef, HttpModule, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RepositoryModule } from "modules/github/repository/repository.module";
import { RepositoryService } from "modules/github/repository/repository.service";
import { TagController } from "./tag.controller";
import { Tag } from "./tag.entity";
import { TagService } from "./tag.service";

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Tag]), forwardRef(() => RepositoryModule)],
  controllers: [TagController],
  providers: [TagService, RepositoryService],
  exports: [TypeOrmModule, TagService]
})
export class TagModule {}
