"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/db"
import { useToast } from "@/hooks/use-toast"
import { Bell, Check, CheckCheck, BookOpen, Award, AlertCircle } from "lucide-react"
import type { Notification } from "@/lib/types"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface NotificationListProps {
  notifications: Notification[]
}

export default function NotificationList({ notifications }: NotificationListProps) {
  const [readingIds, setReadingIds] = useState<string[]>([])
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // 알림 읽음 표시
  const handleMarkAsRead = async (id: string) => {
    setReadingIds((prev) => [...prev, id])

    try {
      await markNotificationAsRead(id)
      router.refresh()
    } catch (error) {
      console.error("알림 읽음 표시 오류:", error)
      toast({
        title: "오류 발생",
        description: "알림을 읽음 표시하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setReadingIds((prev) => prev.filter((item) => item !== id))
    }
  }

  // 모든 알림 읽음 표시
  const handleMarkAllAsRead = async () => {
    if (notifications.filter((n) => !n.read).length === 0) return

    setIsMarkingAll(true)

    try {
      await markAllNotificationsAsRead(notifications[0].user_id)
      toast({
        title: "모든 알림 읽음 표시 완료",
        description: "모든 알림이 읽음 표시되었습니다.",
      })
      router.refresh()
    } catch (error) {
      console.error("모든 알림 읽음 표시 오류:", error)
      toast({
        title: "오류 발생",
        description: "모든 알림을 읽음 표시하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsMarkingAll(false)
    }
  }

  // 알림 아이콘 선택
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <BookOpen className="h-5 w-5" />
      case "grade":
        return <Award className="h-5 w-5" />
      case "goal":
        return <Check className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  // 알림 타입 텍스트
  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case "assignment":
        return "과제"
      case "grade":
        return "성적"
      case "goal":
        return "학습 목표"
      default:
        return "시스템"
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) {
      return `${diffMins}분 전`
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`
    } else if (diffDays < 7) {
      return `${diffDays}일 전`
    } else {
      return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date
        .getDate()
        .toString()
        .padStart(2, "0")}`
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Bell className="mr-2" />
          알림
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={isMarkingAll || unreadCount === 0}>
          <CheckCheck className="mr-2 h-4 w-4" />
          모두 읽음
        </Button>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="mx-auto h-12 w-12 mb-4 opacity-20" />
            <p>알림이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start p-3 rounded-lg border ${
                  notification.read ? "bg-background" : "bg-muted/30"
                }`}
              >
                <div className="mr-3 mt-0.5">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {getNotificationTypeText(notification.type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{formatDate(notification.timestamp)}</span>
                    </div>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={readingIds.includes(notification.id)}
                      >
                        {readingIds.includes(notification.id) ? (
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </div>
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  {notification.link && (
                    <div className="mt-2">
                      <Link
                        href={notification.link}
                        className="text-sm text-primary hover:underline inline-flex items-center"
                      >
                        자세히 보기
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
