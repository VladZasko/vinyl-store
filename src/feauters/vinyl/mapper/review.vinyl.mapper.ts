import { ReviewDBType } from '../../../db/schemes/review.schemes';
import { ReviewsType } from '../model/output/ReviewByVinylViewModel';

export const reviewByVinylMapper = (review: ReviewDBType): ReviewsType => {
  return {
    id: review._id.toString(),
    author: review.author,
    content: review.content,
    createdAt: review.createdAt,
    score: review.score,
  };
};
