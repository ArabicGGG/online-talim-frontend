import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { BookOpen, Users, Award, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Professional Onlayn Ta'lim Platformasi
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Eng yaxshi instruktorlardan o'rganing va o'z karyerangizni yangi bosqichga olib chiqing. Minglab kurslar,
            professional sertifikatlar va amaliy loyihalar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/courses">Kurslarni ko'rish</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">Bepul ro'yxatdan o'tish</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Nima uchun bizni tanlash kerak?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Zamonaviy ta'lim texnologiyalari va professional yondashuv bilan eng sifatli ta'limni taqdim etamiz
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>1000+ Kurslar</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Turli sohalarda professional kurslar va amaliy mashg'ulotlar</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Expert Instruktorlar</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Soha mutaxassislari va tajribali professional instruktorlar</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Sertifikatlar</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Kurs tugagach rasmiy sertifikat va professional tasdiqnoma</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Star className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Yuqori Sifat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>4.8+ yulduzli baholash va minglab mamnun talabalar</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bugun o'rganishni boshlang!</h2>
          <p className="text-xl mb-8 opacity-90">Minglab talaba bizning platformamizda o'z maqsadlariga erishdi</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Bepul boshlash</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">Online Talim</span>
              </div>
              <p className="text-muted-foreground">Professional onlayn ta'lim platformasi</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Kurslar</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/courses?category=programming">Dasturlash</Link>
                </li>
                <li>
                  <Link href="/courses?category=design">Dizayn</Link>
                </li>
                <li>
                  <Link href="/courses?category=business">Biznes</Link>
                </li>
                <li>
                  <Link href="/courses?category=marketing">Marketing</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Kompaniya</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about">Biz haqimizda</Link>
                </li>
                <li>
                  <Link href="/contact">Aloqa</Link>
                </li>
                <li>
                  <Link href="/careers">Karyera</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Yordam</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/help">Yordam markazi</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/privacy">Maxfiylik</Link>
                </li>
                <li>
                  <Link href="/terms">Shartlar</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Online Talim. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
