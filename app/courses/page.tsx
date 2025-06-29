"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { Header } from "@/components/header"
import { CourseCard } from "@/components/course-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { ApiErrorFallback } from "@/components/api-error-fallback"

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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [error, setError] = useState<string | null>(null)

  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Design",
    "Business",
    "Marketing",
    "Photography",
    "Music",
  ]

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const params: any = {}
      if (searchTerm) params.search = searchTerm
      if (selectedCategory) params.category = selectedCategory

      const data = await api.getCourses(params)
      setCourses(Array.isArray(data) ? data : [])
    } catch (error: any) {
      console.error("Failed to fetch courses:", error)
      setCourses([])
      setError(error.message || "Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleSearch = () => {
    fetchCourses()
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === "all" ? "" : category)
  }

  useEffect(() => {
    fetchCourses()
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Barcha Kurslar</h1>
          <p className="text-muted-foreground mb-6">
            Professional instruktorlardan o'rganing va yangi ko'nikmalar egallang
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Kurslarni qidiring..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Qidirish</Button>
            <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Kategoriya" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha kategoriyalar</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Courses Grid */}
        {error ? (
          <div className="py-12">
            <ApiErrorFallback error={error} onRetry={fetchCourses} />
          </div>
        ) : loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-muted rounded h-4 w-3/4"></div>
                  <div className="bg-muted rounded h-4 w-1/2"></div>
                  <div className="bg-muted rounded h-4 w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Hech qanday kurs topilmadi. Qidiruv shartlarini o'zgartiring.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
