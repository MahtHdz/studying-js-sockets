import { Module } from '@nestjs/common';
import { SocketModule } from './app/socket/socket.module';

@Module({
  imports: [SocketModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
