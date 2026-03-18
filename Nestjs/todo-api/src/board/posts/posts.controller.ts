import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CommentsService } from '../comments/comments.service';
import { LikesService } from '../likes/likes.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { UpdateCommentDto } from '../comments/dto/update-comment.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService,
  ) {}

  // ─── Posts CRUD ───────────────────────────────────────────

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.postsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.commentsService.removeAllByPost(id);
    this.likesService.removeAllByPost(id);
    this.postsService.remove(id);
    return { message: `Post #${id} deleted` };
  }

  // ─── Comments ─────────────────────────────────────────────

  @Get(':postId/comments')
  getComments(@Param('postId', ParseIntPipe) postId: number) {
    this.postsService.findOne(postId);
    return this.commentsService.findAllByPost(postId);
  }

  @Post(':postId/comments')
  createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreateCommentDto,
  ) {
    this.postsService.findOne(postId);
    return this.commentsService.create(postId, dto);
  }

  @Patch(':postId/comments/:id')
  updateComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.update(postId, id, dto);
  }

  @Delete(':postId/comments/:id')
  removeComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    this.commentsService.remove(postId, id);
    return { message: `Comment #${id} deleted` };
  }

  // ─── Likes ────────────────────────────────────────────────

  @Get(':postId/likes')
  getLikes(@Param('postId', ParseIntPipe) postId: number) {
    this.postsService.findOne(postId);
    return this.likesService.getCount(postId);
  }

  @Post(':postId/likes')
  toggleLike(
    @Param('postId', ParseIntPipe) postId: number,
    @Body('userId') userId: string,
  ) {
    this.postsService.findOne(postId);
    return this.likesService.toggle(postId, userId);
  }
}
