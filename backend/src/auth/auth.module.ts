import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/chat/entities/channel.entity';
import { JoinedUserStatus } from 'src/chat/entities/joinedUserStatus.entity';
import { MessageEntity } from 'src/chat/entities/message.entity';
import { ChatService } from 'src/chat/service/chat.service';
import { ChatUtilsService } from 'src/chat/service/chatUtils.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FtStrategy } from './strategies/ft.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TfaStrategy } from './strategies/tfa.strategy';
import { getEnvPath } from '../common/helper/env.helper';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs/`);

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath, isGlobal: true }),
    UserModule, TypeOrmModule.forFeature([UserEntity, ChannelEntity, MessageEntity, JoinedUserStatus]), PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {return {secret: process.env.JWT_SECRET, signOptions: { expiresIn: 86400 }}}
    }),
  ],
  exports: [AuthService, JwtStrategy, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, FtStrategy, TfaStrategy, JwtStrategy, ChatUtilsService, ChatService]
})
export class AuthModule {}
