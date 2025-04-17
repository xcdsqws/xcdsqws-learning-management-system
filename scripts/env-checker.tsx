"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

export default function EnvChecker() {
  const [status, setStatus] = useState<{
    supabaseUrl: boolean
    supabaseAnonKey: boolean
    supabaseServiceKey: boolean
    loading: boolean
    error: string | null
  }>({
    supabaseUrl: false,
    supabaseAnonKey: false,
    supabaseServiceKey: false,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const checkEnv = async () => {
      try {
        const response = await fetch("/api/check-env")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "환경 변수 확인 중 오류가 발생했습니다.")
        }

        setStatus({
          supabaseUrl: data.supabaseUrl,
          supabaseAnonKey: data.supabaseAnonKey,
          supabaseServiceKey: data.supabaseServiceKey,
          loading: false,
          error: null,
        })
      } catch (error: any) {
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }))
      }
    }

    checkEnv()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>환경 변수 확인</CardTitle>
        </CardHeader>
        <CardContent>
          {status.loading ? (
            <div className="text-center">환경 변수를 확인하는 중입니다...</div>
          ) : status.error ? (
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-600">{status.error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>SUPABASE_URL</span>
                {status.supabaseUrl ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                {status.supabaseAnonKey ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>SUPABASE_SERVICE_ROLE_KEY</span>
                {status.supabaseServiceKey ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>

              {status.supabaseUrl && status.supabaseAnonKey && status.supabaseServiceKey ? (
                <Alert className="mt-4 bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600">
                    모든 환경 변수가 올바르게 설정되었습니다.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="mt-4 bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-600">
                    일부 환경 변수가 설정되지 않았습니다. Vercel 대시보드에서 환경 변수를 확인해주세요.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
