import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

export interface Todo {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TodosService {
  private todos: Todo[] = [];
  private nextId = 1;

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) throw new NotFoundException(`Todo #${id} not found`);
    return todo;
  }

  create(dto: CreateTodoDto): Todo {
    const todo: Todo = {
      id: this.nextId++,
      title: dto.title,
      description: dto.description ?? '',
      isDone: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.todos.push(todo);
    return todo;
  }

  update(id: number, dto: UpdateTodoDto): Todo {
    const todo = this.findOne(id);
    if (dto.title !== undefined) todo.title = dto.title;
    if (dto.description !== undefined) todo.description = dto.description;
    if (dto.isDone !== undefined) todo.isDone = dto.isDone;
    todo.updatedAt = new Date();
    return todo;
  }

  remove(id: number): void {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException(`Todo #${id} not found`);
    this.todos.splice(index, 1);
  }
}
