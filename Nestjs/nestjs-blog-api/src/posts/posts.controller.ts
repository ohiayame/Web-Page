import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PostsService } from './posts.service';
import type { PostType } from './post.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly PostsService: PostsService) {}

  @Get()
  findAll() {
    return this.PostsService.findAll();
  }

  @Post()
  create(@Body() post: PostType): void {
    this.PostsService.create(post);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.PostsService.findById(id);
  }
}
