"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, BookOpen, ClipboardList, GraduationCap, Home, Settings, Users, BookMarked } from "lucide-react"

export function AdminHeader() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">학습 관리 시스템</span>
            <span className="bg-primary text-white text-xs px-2 py-1 rounded">관리자</span>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <Button variant={isActive("/admin/dashboard") ? "default" : "ghost"} size="sm" asChild>
              <Link href="/admin/dashboard">
                <Home className="h-4 w-4 mr-2" />
                대시보드
              </Link>
            </Button>

            <Button variant={isActive("/admin/students") ? "default" : "ghost"} size="sm" asChild>
              <Link href="/admin/students">
                <Users className="h-4 w-4 mr-2" />
                학생 관리
              </Link>
            </Button>

            <Button variant={isActive("/admin/subjects") ? "default" : "ghost"} size="sm" asChild>
              <Link href="/admin/subjects">
                <BookOpen className="h-4 w-4 mr-2" />
                과목 관리
              </Link>
            </Button>

            <Button variant={isActive("/admin/assignments") ? "default" : "ghost"} size="sm" asChild>
              <Link href="/admin/assignments">
                <ClipboardList className="h-4 w-4 mr-2" />
                과제 관리
              </Link>
            </Button>

            <Button variant={isActive("/admin/grades") ? "default" : "ghost"} size="sm" asChild>
              <Link href="/admin/grades">
                <BarChart3 className="h-4 w-4 mr-2" />
                성적 관리
              </Link>
            </Button>

            <Button variant={isActive("/admin/parents") ? "default" : "ghost"} size="sm" asChild>
              <Link href="/admin/parents">
                <Users className="h-4 w-4 mr-2" />
                학부모 관리
              </Link>
            </Button>

            <Button variant={isActive("/admin/reflections") ? "default" : "ghost"} size="sm" asChild>
              <Link href="/admin/reflections">
                <BookMarked className="h-4 w-4 mr-2" />
                성찰 관리
              </Link>
            </Button>

            <Button variant={isActive("/admin/accounts") ? "default" : "ghost"} size="sm" asChild>
              <Link href="/admin/accounts">
                <Settings className="h-4 w-4 mr-2" />
                계정 관리
              </Link>
            </Button>
          </nav>

          <div className="flex items-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">로그아웃</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
