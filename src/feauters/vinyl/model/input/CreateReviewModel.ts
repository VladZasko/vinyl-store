import { IsInt, Length, Max, Min } from 'class-validator';

export class CreateReviewModel {
  @Length(20, 300)
  content: string;

  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}
