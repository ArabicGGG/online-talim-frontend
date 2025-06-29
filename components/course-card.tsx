"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, ShoppingCart } from "lucide-react"
import { useCart } from "./cart-provider"
import { useAuth } from "./auth-provider"
import { useToast } from "@/hooks/use-toast"

interface Course {
  id: number
  title: string
  description: string
  instructor_name: string
  price: number
  duration: string
  level: string
  category: string
  image_url?: string
  rating: number
  students_count: number
}

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Tizimga kirish kerak",
        description: "Kursni savatga qo'shish uchun tizimga kiring",
        variant: "destructive",
      })
      return
    }

    try {
      await addToCart(course.id)
      toast({
        title: "Savatga qo'shildi",
        description: `${course.title} kursi savatga qo'shildi`,
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

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={course.image_url || "/placeholder.svg?height=200&width=300"}
            alt={course.title}
            fill
            className="object-cover rounded-t-lg"
          />
          <div className="absolute top-2 left-2">
            <Badge className={getLevelColor(course.level)}>{getLevelText(course.level)}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs">
            {course.category}
          </Badge>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>

        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{course.description}</p>

        <p className="text-sm text-muted-foreground mb-3">Instruktor: {course.instructor_name}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.students_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="text-2xl font-bold text-primary mb-4">{formatPrice(course.price)}</div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild className="flex-1">
          <Link href={`/courses/${course.id}`}>Batafsil</Link>
        </Button>
        <Button variant="outline" size="icon" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
