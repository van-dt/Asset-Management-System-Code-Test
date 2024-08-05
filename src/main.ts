import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { urlencoded, json } from 'express';
import helmet from 'helmet';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';

import { getWinstonFormat, getWinstonPathFile } from '@helper/utils';

import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      format: getWinstonFormat(),
      transports: [
        getWinstonPathFile(),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
    rawBody: true,
  });

  app.setGlobalPrefix('api/v1');

  // Blocks others from loading your resources cross-origin
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  // enable cross-origin authorization for Frontend
  // app.enableCors({
  //   origin: [],
  //   credentials: true,
  // });

  // somewhere in your initialization file
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const port = process.env.PORT || 3009;
  await app.listen(port);
  console.info(`\nServer is running on port ${port}\n`);
}

bootstrap();
