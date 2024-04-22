import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';
import { Like } from './like.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  lastName: string;

  @Column()
  firstName: string;

  @Column()
  createdAt: string;

  @Column()
  passwordHash: string;

  @Column()
  passwordSalt: string;

  @OneToMany(() => Post, (p) => p.user)
  post: Post[];

  @OneToMany(() => Like, (l) => l.user)
  likes: Like[];
}
