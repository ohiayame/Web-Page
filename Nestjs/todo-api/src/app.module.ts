import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [BoardModule, TodosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
