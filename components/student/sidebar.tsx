"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/types"
import { BookOpen, Calendar, Clock, FileText, Home, BarChart2, PenTool, Award, Bell, Settings } from "lucide-react"

interface StudentSidebarProps {
  user: User
}

export default function StudentSidebar({ user }: StudentSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "대시보드",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "학습 관리",
      items: [
        {
          title: "과제 관리",
          href: "/assignments",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "학습 기록",
          href: "/study-logs",
          icon: <Clock className="h-5 w-5" />,
        },
        {
          title: "학습 타이머",
          href: "/timer",
          icon: <Calendar className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "성적 및 분석",
      items: [
        {
          title: "성적 관리",
          href: "/grades",
          icon: <Award className="h-5 w-5" />,
        },
        {
          title: "학습 리포트",
          href: "/reports",
          icon: <BarChart2 className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "성찰 및 계획",
      items: [
        {
          title: "학습 성찰",
          href: "/reflections",
          icon: <PenTool className="h-5 w-5" />,
        },
        {
          title: "학습 목표",
          href: "/goals",
          icon: <BookOpen className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "알림 및 설정",
      items: [
        {
          title: "알림",
          href: "/notifications",
          icon: <Bell className="h-5 w-5" />,
        },
        {
          title: "설정",
          href: "/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ],
    },
  ]

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r h-screen sticky top-0">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">학습 관리 시스템</h2>
        <div className="text-sm text-gray-500 mt-1">
          {user.grade}학년 {user.class}반 {user.number}번 {user.name}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-6">
          {menuItems.map((section, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">{section.title}</h3>
              {section.items ? (
                <ul className="space-y-1">
                  {section.items.map((item, j) => (
                    <li key={j}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          pathname === item.href
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "text-gray-700 hover:bg-gray-50",
                        )}
                      >
                        {item.icon}
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <Link
                  href={section.href!}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    pathname === section.href
                      ? "bg-gray-100 text-gray-900 font-medium"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  {section.icon}
                  {section.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
