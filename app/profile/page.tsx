"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Header } from "@/components/header"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { User, Camera, Save } from "lucide-react"

interface ProfileData {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
  bio?: string
  phone?: string
  location?: string
  website?: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchProfile = async () => {
      try {
        const data = await api.getProfile()
        setProfile(data)
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, router])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      setSaving(true)
      await api.updateProfile({
        name: profile.name,
        bio: profile.bio,
        phone: profile.phone,
        location: profile.location,
        website: profile.website,
      })
      await refreshUser()
      toast({
        title: "Profil yangilandi",
        description: "Sizning profil ma'lumotlaringiz muvaffaqiyatli yangilandi",
      })
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.message || "Profilni yangilashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fayl hajmi katta",
        description: "Avatar hajmi 5MB dan oshmasligi kerak",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)
      const response = await api.uploadAvatar(file)
      setProfile((prev) => (prev ? { ...prev, avatar: response.avatar_url } : null))
      await refreshUser()
      toast({
        title: "Avatar yangilandi",
        description: "Sizning avatar rasmingiz muvaffaqiyatli yangilandi",
      })
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.message || "Avatarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="bg-muted rounded-lg h-64"></div>
              <div className="bg-muted rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profil topilmadi</h1>
            <p className="text-muted-foreground">Profil ma'lumotlarini yuklashda xatolik yuz berdi.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <User className="h-6 w-6" />
            <h1 className="text-3xl font-bold">Profil</h1>
          </div>

          <div className="space-y-6">
            {/* Avatar Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profil rasmi</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
                  <AvatarFallback className="text-2xl">{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button variant="outline" disabled={uploading} asChild>
                      <span>
                        <Camera className="mr-2 h-4 w-4" />
                        {uploading ? "Yuklanmoqda..." : "Rasm yuklash"}
                      </span>
                    </Button>
                  </Label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground mt-2">JPG, PNG yoki GIF. Maksimal hajm 5MB.</p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form */}
            <Card>
              <CardHeader>
                <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">To'liq ism *</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={profile.email} disabled className="bg-muted" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="O'zingiz haqingizda qisqacha ma'lumot..."
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon raqami</Label>
                      <Input
                        id="phone"
                        value={profile.phone || ""}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+998 90 123 45 67"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Joylashuv</Label>
                      <Input
                        id="location"
                        value={profile.location || ""}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Toshkent, O'zbekiston"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Veb-sayt</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profile.website || ""}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>

                  <Button type="submit" disabled={saving} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Hisob ma'lumotlari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Rol:</span>
                  <span className="font-medium">{profile.role === "student" ? "Talaba" : "Instruktor"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-medium">{profile.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span className="font-medium">#{profile.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
