import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { writeFileSync } from "fs";
export default function (ormConfig: TypeOrmModuleOptions) {
  writeFileSync("ormconfig.json", JSON.stringify(ormConfig, null, 2));
}
