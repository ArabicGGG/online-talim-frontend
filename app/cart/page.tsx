"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Trash2, CreditCard } from "lucide-react"

export default function CartPage() {
  const { items, removeFromCart, checkout, loading } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleRemoveFromCart = async (courseId: number) => {
    try {
      await removeFromCart(courseId)
      toast({
        title: "O'chirildi",
        description: "Kurs savatdan o'chirildi",
      })
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.message || "Kursni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async () => {
    try {
      await checkout()
      toast({
        title: "Muvaffaqiyatli!",
        description: "Kurslar muvaffaqiyatli sotib olindi",
      })
      router.push("/my-courses")
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.message || "To'lovda xatolik yuz berdi",
        variant: "destructive",
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm"
  }

  const totalPrice = items.reduce((sum, item) => sum + item.course_price, 0)

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <ShoppingCart className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Savatcha</h1>
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="bg-muted rounded-lg h-20 w-32"></div>
                        <div className="flex-1 space-y-2">
                          <div className="bg-muted rounded h-4 w-3/4"></div>
                          <div className="bg-muted rounded h-4 w-1/2"></div>
                          <div className="bg-muted rounded h-4 w-1/4"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <div className="bg-muted rounded-lg h-64"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-24 w-24 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-semibold mb-4">Savatcha bo'sh</h2>
            <p className="text-muted-foreground mb-6">
              Hali hech qanday kurs qo'shilmagan. Kurslarni ko'rib chiqing va o'zingizga mos keladiganini tanlang.
            </p>
            <Button onClick={() => router.push("/courses")}>Kurslarni ko'rish</Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden">
                        <Image
                          src={item.course_image || "/placeholder.svg?height=80&width=128"}
                          alt={item.course_title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.course_title}</h3>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-primary">{formatPrice(item.course_price)}</div>
                          <Button variant="outline" size="sm" onClick={() => handleRemoveFromCart(item.course_id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            O'chirish
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-8">
              <Card>
                <CardHeader>
                  <CardTitle>Buyurtma xulosasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Kurslar soni:</span>
                      <span>{items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Jami summa:</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Umumiy summa:</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>

                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    <CreditCard className="mr-2 h-4 w-4" />
                    To'lovni amalga oshirish
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">To'lov xavfsiz va himoyalangan</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
