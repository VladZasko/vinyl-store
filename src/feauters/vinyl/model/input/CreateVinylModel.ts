import { IsInt, Length, Max, Min } from 'class-validator';

export class CreateVinylModel {
  @Length(2, 30)
  title: string;

  @Length(2, 30)
  author: string;

  @Length(2, 300)
  description: string;

  @IsInt()
  @Min(1)
  @Max(1000)
  price: number;

  @IsInt()
  @Min(1)
  @Max(1000)
  quantity: number;
}
