import { VinylDBType } from '../../../db/schemes/vinyl.shemes';
import { ReviewDBType } from '../../../db/schemes/review.schemes';
import { VinylsAllUserType } from '../model/output/VinylsAllUsersViewModel';

export const vinylViewUnauthorizedMapper = (
  vinyls: VinylDBType,
  review: ReviewDBType[],
  score: ReviewDBType[],
): VinylsAllUserType => {
  let firstReview: any = 'None';
  let averageScore: any = 0;

  const findReview: ReviewDBType = review.find(
    (r) => r.vinylId === vinyls._id.toString(),
  );
  const scoreForVinyl: ReviewDBType[] = score.filter(
    (s) => s.vinylId === vinyls._id.toString(),
  );

  if (scoreForVinyl) {
    averageScore =
      scoreForVinyl.reduce((acc, obj) => acc + obj.score, 0) /
      scoreForVinyl.length;
  }
  if (findReview) {
    firstReview = {
      author: findReview.author,
      content: findReview.content,
    };
  }
  return {
    title: vinyls.title,
    author: vinyls.author,
    description: vinyls.description,
    price: vinyls.price,
    average: averageScore,
    firstReview: firstReview,
  };
};
