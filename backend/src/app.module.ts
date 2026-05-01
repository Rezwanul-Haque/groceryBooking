import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infra/database/database.module';
import { LoggerModule } from './infra/logger/logger.module';
import { RequestLoggerMiddleware } from './infra/middleware/request-logger.middleware';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { GroceriesModule } from './features/groceries/groceries.module';
import { OrdersModule } from './features/orders/orders.module';
import configuration from './shared/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    DatabaseModule,
    LoggerModule,
    AuthModule,
    UsersModule,
    GroceriesModule,
    OrdersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
