import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string;

  @ManyToOne(() => Post, (p) => p.likes)
  post: Post;

  @Column()
  userId: string;

  @ManyToOne(() => User, (u) => u.likes)
  user: User;
}
