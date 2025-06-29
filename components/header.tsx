"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { useCart } from "./cart-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, User, LogOut, BookOpen, Settings } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()
  const { count } = useCart()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Online Talim</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/courses" className="text-sm font-medium hover:text-primary">
            Kurslar
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            Biz haqimizda
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary">
            Aloqa
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="sm">
                  <ShoppingCart className="h-4 w-4" />
                  {count > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {count}
                    </Badge>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-courses">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Mening kurslarim
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "instructor" && (
                    <DropdownMenuItem asChild>
                      <Link href="/instructor/dashboard">
                        <Settings className="mr-2 h-4 w-4" />
                        Instruktor paneli
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Chiqish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Kirish</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Ro'yxatdan o'tish</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
