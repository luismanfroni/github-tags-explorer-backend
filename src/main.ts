import { NestFactory } from "@nestjs/core";
import { ConfigurationService } from "config/config.service";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import genOrmConfig from "utils/genOrmConfig";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  const config = app.get(ConfigurationService);
  if (!config.isProduction()) {
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("Tags API")
      .setDescription("Github Tags Explorer API Documentation")
      .build()
  );

  SwaggerModule.setup("docs", app, document);
  }
  genOrmConfig(config.getTypeOrmConfig());
  await app.listen(config.getPort());
}
bootstrap();
