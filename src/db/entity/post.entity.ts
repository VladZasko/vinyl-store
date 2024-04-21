import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Like } from './like.entity';
import { User } from './user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  createdAt: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (u) => u.post)
  user: User;

  @OneToMany(() => Like, (l) => l.user)
  likes: Like[];
}
