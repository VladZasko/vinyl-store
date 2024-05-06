import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../repository/review.repository';

@Injectable()
export class ReviewService {
  constructor(protected reviewRepository: ReviewRepository) {}

  async deleteReview(reviewId: string) {
    return this.reviewRepository.deleteReview(reviewId);
  }
}
