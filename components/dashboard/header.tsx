"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { logout } from "@/lib/auth"
import type { User } from "@/lib/types"
import { formatStudentInfo } from "@/lib/utils"
import { Bell, BookOpen, ChevronDown, LogOut, Menu, Moon, Settings, Sun, UserIcon } from "lucide-react"
import StudentSidebar from "@/components/student/sidebar"

interface DashboardHeaderProps {
  user: User
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
    } catch (error) {
      console.error("로그아웃 오류:", error)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">학습 관리 시스템</h2>
            <div className="text-sm text-gray-500 mt-1">
              {user.role === "student"
                ? `${formatStudentInfo(user.grade, user.class, user.number)} ${user.name}`
                : user.name}
            </div>
          </div>
          {user.role === "student" && <StudentSidebar user={user} />}
        </SheetContent>
      </Sheet>

      <Link
        href={user.role === "admin" ? "/admin/dashboard" : user.role === "parent" ? "/parent/dashboard" : "/dashboard"}
        className="flex items-center gap-2"
      >
        <BookOpen className="h-6 w-6" />
        <span className="font-semibold">학습 관리 시스템</span>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden md:flex">
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          <span className="sr-only">테마 변경</span>
        </Button>

        <Button variant="ghost" size="icon" asChild>
          <Link href="/notifications">
            <Bell className="h-5 w-5" />
            <span className="sr-only">알림</span>
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              <span className="hidden md:inline-block">{user.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div>{user.name}</div>
              <div className="text-xs text-muted-foreground">
                {user.role === "student" && formatStudentInfo(user.grade, user.class, user.number)}
                {user.role === "admin" && "관리자"}
                {user.role === "parent" && "학부모"}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>설정</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
