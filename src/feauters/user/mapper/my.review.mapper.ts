import { ReviewDBType } from '../../../db/schemes/review.schemes';
import { VinylDBType } from '../../../db/schemes/vinyl.shemes';
import { MyReviewType } from '../model/output/MyReviewViewModel';

export const myReviewMapper = (
  review: ReviewDBType,
  vinyl: VinylDBType[],
): MyReviewType => {
  const findVinyl: VinylDBType = vinyl.find(
    (v) => v._id.toString() === review.vinylId,
  );
  return {
    vinylTitle: findVinyl.title,
    content: review.content,
    createdAt: review.createdAt,
    score: review.score,
  };
};
