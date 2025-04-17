"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"

interface ParentHeaderProps {
  user: User
}

export default function ParentHeader({ user }: ParentHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold">학습 관리 시스템</h2>
            <span className="text-gray-500">|</span>
            <span className="text-gray-700">학부모: {user.name}</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/parent/dashboard" className="text-gray-700 hover:text-gray-900">
              대시보드
            </Link>
            <Link href="/parent/assignments" className="text-gray-700 hover:text-gray-900">
              과제 현황
            </Link>
            <Link href="/parent/reports" className="text-gray-700 hover:text-gray-900">
              학습 보고서
            </Link>
            <Link href="/parent/reflections" className="text-gray-700 hover:text-gray-900">
              학습 성찰
            </Link>
          </nav>

          <Button variant="outline" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  )
}
