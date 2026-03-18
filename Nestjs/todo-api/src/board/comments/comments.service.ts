import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

export interface Comment {
  id: number;
  postId: number;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CommentsService {
  private comments: Comment[] = [];
  private nextId = 1;

  findAllByPost(postId: number): Comment[] {
    return this.comments.filter((c) => c.postId === postId);
  }

  findOne(postId: number, id: number): Comment {
    const comment = this.comments.find(
      (c) => c.id === id && c.postId === postId,
    );
    if (!comment) throw new NotFoundException(`Comment #${id} not found`);
    return comment;
  }

  create(postId: number, dto: CreateCommentDto): Comment {
    const comment: Comment = {
      id: this.nextId++,
      postId,
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.comments.push(comment);
    return comment;
  }

  update(postId: number, id: number, dto: UpdateCommentDto): Comment {
    const comment = this.findOne(postId, id);
    comment.content = dto.content;
    comment.updatedAt = new Date();
    return comment;
  }

  remove(postId: number, id: number): void {
    const index = this.comments.findIndex(
      (c) => c.id === id && c.postId === postId,
    );
    if (index === -1) throw new NotFoundException(`Comment #${id} not found`);
    this.comments.splice(index, 1);
  }

  removeAllByPost(postId: number): void {
    this.comments = this.comments.filter((c) => c.postId !== postId);
  }
}
