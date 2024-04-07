import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/auth';
import { BlacklistService } from './services/blacklist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import configuration from 'src/config/configuration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    JwtModule.register({
      global: true,
      secret: configuration().jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService, BlacklistService]
})
export class UsersModule {}
