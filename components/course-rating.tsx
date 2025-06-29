"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useAuth } from "./auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Star } from "lucide-react"

interface Rating {
  id: number
  user_name: string
  rating: number
  created_at: string
}

interface CourseRatingProps {
  courseId: number
}

export function CourseRating({ courseId }: CourseRatingProps) {
  const [ratings, setRatings] = useState<Rating[]>([])
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchRatings = async () => {
    try {
      const data = await api.getCourseRatings(courseId)
      setRatings(data.ratings || [])

      // Find user's existing rating
      if (user) {
        const existingRating = data.ratings?.find((r: Rating) => r.user_name === user.name)
        if (existingRating) {
          setUserRating(existingRating.rating)
        }
      }
    } catch (error) {
      console.error("Failed to fetch ratings:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRatings()
  }, [courseId, user])

  const handleRatingSubmit = async (rating: number) => {
    if (!user) {
      toast({
        title: "Tizimga kirish kerak",
        description: "Baho berish uchun tizimga kiring",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      await api.addCourseRating(courseId, rating)
      setUserRating(rating)
      await fetchRatings()
      toast({
        title: "Baho berildi",
        description: `Siz ${rating} yulduz baho berdingiz`,
      })
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.message || "Baho berishda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const averageRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r.rating === star).length,
    percentage: ratings.length > 0 ? (ratings.filter((r) => r.rating === star).length / ratings.length) * 100 : 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Baholar va Sharhlar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 ${
                  star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-muted-foreground">{ratings.length} ta baho</p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-8">{star}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 bg-muted rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
              </div>
              <span className="w-8 text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>

        {/* User Rating */}
        {user && (
          <div className="border-t pt-6">
            <h4 className="font-medium mb-3">{userRating > 0 ? "Sizning bahongiz:" : "Baho bering:"}</h4>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRatingSubmit(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={submitting}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || userRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                  />
                </button>
              ))}
            </div>
            {userRating > 0 && <p className="text-sm text-muted-foreground">Siz {userRating} yulduz baho berdingiz</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
