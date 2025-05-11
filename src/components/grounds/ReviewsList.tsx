
import { format } from "date-fns";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Review {
  id: string;
  rating: number;
  feedback_date: string;
  userName: string;
  userAvatar: string | null;
}

interface ReviewsListProps {
  reviews: Review[];
}

const ReviewsList = ({ reviews }: ReviewsListProps) => {
  if (reviews.length === 0) {
    return <p className="text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-4">
            <div className="flex items-start">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={review.userAvatar || undefined} />
                <AvatarFallback>{review.userName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <p className="font-medium">{review.userName}</p>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(review.feedback_date), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center mt-1">
                  {Array(5).fill(0).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsList;
