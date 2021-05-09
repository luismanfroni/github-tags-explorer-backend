import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("api");
  app.use(cookieParser());
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("Tags API")
      .setDescription("Github Tags Explorer API Documentation")
      .build()
  );

  SwaggerModule.setup("docs", app, document);
  await app.listen(3000);
}
bootstrap();
