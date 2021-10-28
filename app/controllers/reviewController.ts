import { reviewService } from '../services/reviewService';
import { reviewApi } from '../api';

const review = reviewService(reviewApi);

export const reviewCommands = [
  {
    name: 'review',
    cb: review.setReview
  },
  {
    name: 'end_review',
    cb: review.endReview
  },
  {
    name: 'check_status',
    cb: review.checkStatus
  },
  {
    name: 'check_all',
    cb: review.checkAllStatus
  },
  {
    name: 'clear_all',
    cb: review.clearAllReviews
  }
];
