import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './core/global/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './core/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './helper/httpException.filter';
import { LoggerMiddleware } from './helper/logger.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobsModule } from './modules/cron-jobs/cron-jobs.module';
import { DevicesModule } from './modules/devices/devices.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    CronJobsModule,
    DevicesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
