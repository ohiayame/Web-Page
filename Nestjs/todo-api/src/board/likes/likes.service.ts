import { Injectable } from '@nestjs/common';

@Injectable()
export class LikesService {
  private likes = new Map<number, Set<string>>();

  private getOrCreate(postId: number): Set<string> {
    if (!this.likes.has(postId)) {
      this.likes.set(postId, new Set());
    }
    return this.likes.get(postId)!;
  }

  toggle(postId: number, userId: string): { liked: boolean; count: number } {
    const set = this.getOrCreate(postId);
    if (set.has(userId)) {
      set.delete(userId);
      return { liked: false, count: set.size };
    } else {
      set.add(userId);
      return { liked: true, count: set.size };
    }
  }

  getCount(postId: number): { count: number } {
    return { count: this.getOrCreate(postId).size };
  }

  removeAllByPost(postId: number): void {
    this.likes.delete(postId);
  }
}
