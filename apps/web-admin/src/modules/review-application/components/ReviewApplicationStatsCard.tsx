import {
  MessageSquare,
  Star,
  TrendingUp,
  ThumbsUp,
  Users,
  AlertTriangle,
} from "lucide-react";

import { useReviewApplication } from "../context/useReviewApplication";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@skillsmatch/ui";

export default function ReviewApplicationStatsCard() {
  const {
    statsQuery: { data, error, isLoading },
  } = useReviewApplication();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  const {
    totalReviews = 0,
    averageRating = 0,
    recentReviews = 0,
    highRatingPercentage = 0,
    lowRatingPercentage = 0,
    ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    roleDistribution = {},
  } = data ?? {};

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Reviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReviews}</div>
          <p className="text-xs text-muted-foreground">All time feedback</p>
        </CardContent>
      </Card>

      {/* Average Rating */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-1">
            {averageRating.toFixed(2)}
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
          </div>
          <p className="text-xs text-muted-foreground">Out of 5.0 stars</p>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Reviews</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentReviews}</div>
          <p className="text-xs text-muted-foreground">Last 7 days</p>
        </CardContent>
      </Card>

      {/* Satisfaction Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Satisfaction Rate
          </CardTitle>
          <ThumbsUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {highRatingPercentage.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">4-5 star reviews</p>
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Rating Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                ratingDistribution[rating as keyof typeof ratingDistribution] ??
                0;
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* User Roles */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Reviews by User Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(roleDistribution).map(([role, count]) => (
              <Badge
                key={role}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Users className="h-3 w-3" />
                {role}: {count}
              </Badge>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {Object.entries(roleDistribution).map(([role, count]) => {
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{role}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Issues Alert */}
      {lowRatingPercentage > 20 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Issues Detected
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {lowRatingPercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-red-700">Low ratings (1-2 stars)</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
