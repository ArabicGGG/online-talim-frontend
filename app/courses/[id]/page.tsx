"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { api } from "@/lib/api"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseComments } from "@/components/course-comments"
import { CourseRating } from "@/components/course-rating"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Star, Clock, Users, BookOpen, ShoppingCart, Play } from "lucide-react"

interface Course {
  id: number
  title: string
  description: string
  instructor_name: string
  instructor_bio: string
  price: number
  duration: string
  level: string
  category: string
  image_url?: string
  rating: number
  students_count: number
  lessons: Array<{
    id: number
    title: string
    duration: string
    is_free: boolean
  }>
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = Number.parseInt(params.id as string)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await api.getCourse(courseId)
        setCourse(data)
      } catch (error) {
        console.error("Failed to fetch course:", error)
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourse()
    }
  }, [courseId])

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Tizimga kirish kerak",
        description: "Kursni sotib olish uchun tizimga kiring",
        variant: "destructive",
      })
      return
    }

    try {
      await addToCart(courseId)
      toast({
        title: "Savatga qo'shildi",
        description: `${course?.title} kursi savatga qo'shildi`,
      })
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.message || "Kursni savatga qo'shishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  const getLevelText = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "Boshlang'ich"
      case "intermediate":
        return "O'rta"
      case "advanced":
        return "Yuqori"
      default:
        return level
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-muted rounded-lg h-64 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-muted rounded h-8 w-3/4"></div>
                <div className="bg-muted rounded h-4 w-full"></div>
                <div className="bg-muted rounded h-4 w-full"></div>
                <div className="bg-muted rounded h-4 w-2/3"></div>
              </div>
              <div className="bg-muted rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Kurs topilmadi</h1>
            <p className="text-muted-foreground">Siz qidirayotgan kurs mavjud emas yoki o'chirilgan.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="relative aspect-video mb-6">
              <Image
                src={course.image_url || "/placeholder.svg?height=400&width=600"}
                alt={course.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge variant="outline">{getLevelText(course.level)}</Badge>
            </div>

            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

            <div className="flex items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.students_count} talaba</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.lessons?.length || 0} dars</span>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">
              Instruktor: <span className="font-medium">{course.instructor_name}</span>
            </p>
          </div>

          {/* Purchase Card */}
          <div className="lg:sticky lg:top-8">
            <Card>
              <CardHeader>
                <div className="text-3xl font-bold text-primary mb-2">{formatPrice(course.price)}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleAddToCart} className="w-full" size="lg">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Savatga qo'shish
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Play className="mr-2 h-4 w-4" />
                  Bepul darsni ko'rish
                </Button>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Daraja:</span>
                    <span>{getLevelText(course.level)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Davomiyligi:</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Darslar soni:</span>
                    <span>{course.lessons?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sertifikat:</span>
                    <span>Ha</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content */}
        <Tabs defaultValue="description" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Tavsif</TabsTrigger>
            <TabsTrigger value="curriculum">Dastur</TabsTrigger>
            <TabsTrigger value="instructor">Instruktor</TabsTrigger>
            <TabsTrigger value="reviews">Sharhlar</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kurs haqida</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{course.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Kurs dasturi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.lessons?.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{lesson.title}</h4>
                          <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.is_free && <Badge variant="secondary">Bepul</Badge>}
                        <Play className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructor" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Instruktor haqida</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold">{course.instructor_name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{course.instructor_name}</h3>
                    <p className="text-muted-foreground">Professional Instruktor</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {course.instructor_bio || "Instruktor haqida ma'lumot mavjud emas."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <CourseRating courseId={courseId} />
              <CourseComments courseId={courseId} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
