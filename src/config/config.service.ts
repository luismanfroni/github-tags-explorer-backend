import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

interface DatabaseConfig {
  host: string;
  dockerName: string;
  port: string;
  name: string;
  user: string;
  password: string;
}

interface AppConfig {
  secret: string;
  port: string | number;
  database: DatabaseConfig;
  mode: string;
  frontendUrl: string;
  github: {
    secret: string;
    client: string;
    callback: string;
  };
}

interface ApiConfig {
  github: {
    scope: string;
    oauthEndpoint: string;
    apiEndpoint: string;
  };
}
interface Config {
  app: AppConfig;
  api: ApiConfig;
}
@Injectable()
export class ConfigurationService {
  private readonly config: Config;
  constructor() {
    this.config = {
      app: {
        secret: process.env.APP_SECRET,
        port: process.env.PORT || 3030,
        database: {
          host: process.env.DB_HOST,
          dockerName: process.env.DB_DOCKER_NAME,
          port: process.env.DB_PORT,
          name: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PW
        },
        mode: process.env.MODE || "DEV",
        frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
        github: {
          secret: process.env.GITHUB_SECRET,
          client: process.env.GITHUB_CLIENT,
          callback: process.env.GITHUB_CALLBACK
        }
      },
      api: {
        github: {
          scope: "read:user",
          oauthEndpoint: "https://github.com/login/oauth",
          apiEndpoint: "https://api.github.com"
        }
      }
    };
  }
  public getJWTSecret(): string {
    return this.config.app.secret;
  }
  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: "postgres",
      host: this.config.app.database.host,
      port: parseInt(this.config.app.database.port),
      username: this.config.app.database.user,
      password: this.config.app.database.password,
      database: this.config.app.database.name,
      entities: ["dist/**/*.entity{.ts,.js}"],
      migrationsTableName: "migration",
      migrations: ["dist/migration/*{.ts,.js}"],
      cli: {
        migrationsDir: "src/migration"
      },
      ssl: this.isProduction()
    };
  }
  public getPort() {
    return this.config.app.port;
  }
  public isProduction() {
    const mode = this.config.app.mode;
    return mode != "DEV";
  }
  public getGithubConfig(): AppConfig["github"] {
    return this.config.app.github;
  }
  public getGithubApi(): ApiConfig["github"] {
    return this.config.api.github;
  }
  public getFrontendUrl(): string {
    return this.config.app.frontendUrl;
  }
}
