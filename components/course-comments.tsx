"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Send } from "lucide-react"

interface Comment {
  id: number
  user_name: string
  user_avatar?: string
  comment: string
  created_at: string
}

interface CourseCommentsProps {
  courseId: number
}

export function CourseComments({ courseId }: CourseCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchComments = async () => {
    try {
      const data = await api.getCourseComments(courseId)
      setComments(data.comments || [])
    } catch (error) {
      console.error("Failed to fetch comments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [courseId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Tizimga kirish kerak",
        description: "Izoh qoldirish uchun tizimga kiring",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Xatolik",
        description: "Izoh matnini kiriting",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      await api.addCourseComment(courseId, newComment.trim())
      setNewComment("")
      await fetchComments()
      toast({
        title: "Izoh qo'shildi",
        description: "Sizning izohingiz muvaffaqiyatli qo'shildi",
      })
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.message || "Izoh qo'shishda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Izohlar ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        {user && (
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <Textarea
              placeholder="Kurs haqida fikringizni bildiring..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button type="submit" disabled={submitting}>
              <Send className="mr-2 h-4 w-4" />
              {submitting ? "Yuborilmoqda..." : "Izoh qoldirish"}
            </Button>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-muted rounded h-4 w-1/4"></div>
                    <div className="bg-muted rounded h-4 w-full"></div>
                    <div className="bg-muted rounded h-4 w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 border rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={comment.user_avatar || "/placeholder.svg"} alt={comment.user_name} />
                  <AvatarFallback>{comment.user_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{comment.user_name}</span>
                    <span className="text-sm text-muted-foreground">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-muted-foreground">{comment.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Hali izohlar yo'q. Birinchi bo'lib izoh qoldiring!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
