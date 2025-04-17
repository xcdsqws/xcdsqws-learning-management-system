"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/types"
import {
  Users,
  FileText,
  Home,
  BarChart2,
  PenTool,
  Award,
  Settings,
  UserPlus,
  Database,
  BookMarked,
  UserCheck,
} from "lucide-react"

interface AdminSidebarProps {
  user: User
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "대시보드",
      href: "/admin/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "사용자 관리",
      items: [
        {
          title: "학생 관리",
          href: "/admin/students",
          icon: <Users className="h-5 w-5" />,
        },
        {
          title: "계정 관리",
          href: "/admin/accounts",
          icon: <UserPlus className="h-5 w-5" />,
        },
        {
          title: "학부모 관리",
          href: "/admin/parents",
          icon: <UserCheck className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "학습 관리",
      items: [
        {
          title: "과제 관리",
          href: "/admin/assignments",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          title: "성적 관리",
          href: "/admin/grades",
          icon: <Award className="h-5 w-5" />,
        },
        {
          title: "과목 관리",
          href: "/admin/subjects",
          icon: <BookMarked className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "분석 및 보고서",
      items: [
        {
          title: "리포트 관리",
          href: "/admin/reports",
          icon: <BarChart2 className="h-5 w-5" />,
        },
        {
          title: "성찰 관리",
          href: "/admin/reflections",
          icon: <PenTool className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "시스템 관리",
      items: [
        {
          title: "데이터 관리",
          href: "/admin/export",
          icon: <Database className="h-5 w-5" />,
        },
        {
          title: "시스템 설정",
          href: "/admin/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ],
    },
  ]

  return (
    <div className="hidden md:flex flex-col w-64 bg-white border-r h-screen sticky top-0">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">학습 관리 시스템</h2>
        <div className="text-sm text-gray-500 mt-1">관리자: {user.name}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-6">
          {menuItems.map((section, i) => (
            <div key={i}>
              {section.href ? (
                <Link
                  href={section.href}
                  className={cn(
                    "flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-gray-100 transition",
                    pathname === section.href ? "bg-gray-100 font-bold" : "",
                  )}
                >
                  {section.icon}
                  <span>{section.title}</span>
                </Link>
              ) : (
                <div>
                  <div className="text-sm font-medium text-gray-500">{section.title}</div>
                  <div className="mt-2 space-y-1">
                    {section.items?.map((item, key) => (
                      <Link
                        key={key}
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-gray-100 transition",
                          pathname === item.href ? "bg-gray-100 font-bold" : "",
                        )}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
