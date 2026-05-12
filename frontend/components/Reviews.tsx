'use client';

interface ReviewProps {
  rating: number;
  title: string;
  comment: string;
  authorName: string;
  authorRole?: string;
}

export function ReviewCard({ rating, title, comment, authorName, authorRole }: ReviewProps) {
  return (
    <div className="card-elevated h-full flex flex-col">
      {/* Star rating */}
      <div className="flex items-center gap-0.5 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`text-lg ${i < rating ? 'text-gold-500' : 'text-gray-200'}`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Title */}
      {title && <h4 className="font-bold text-gray-900 mb-2">{title}</h4>}

      {/* Comment */}
      <p className="text-gray-600 text-sm mb-4 leading-relaxed flex-1">{comment}</p>

      {/* Author */}
      <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 text-xs font-black shrink-0">
          {authorName.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{authorName}</p>
          {authorRole && <p className="text-xs text-gray-400">{authorRole}</p>}
        </div>
      </div>
    </div>
  );
}

interface RatingStatsProps {
  average: number;
  total: number;
  breakdown: Record<number, number>;
}

export function RatingStats({ average, total, breakdown }: RatingStatsProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-black text-gold-500">{average.toFixed(1)}</span>
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-2xl ${i < Math.round(average) ? 'text-gold-500' : 'text-gray-200'}`}>
                {i < Math.round(average) ? '★' : '☆'}
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500">Based on {total} reviews</p>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 w-8">{stars}★</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold-500 rounded-full"
                style={{
                  width: `${total > 0 ? ((breakdown[stars] || 0) / total) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-xs text-gray-400 w-12 text-right">{breakdown[stars] || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewsCarousel({ reviews }: { reviews: ReviewProps[] }) {
  if (!reviews.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review, i) => (
        <div key={i} className="fade-in-delay-1 animate-fade-in">
          <ReviewCard {...review} />
        </div>
      ))}
    </div>
  );
}
