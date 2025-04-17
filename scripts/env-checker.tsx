"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"

export default function EnvChecker() {
  const [envStatus, setEnvStatus] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkEnvVariables = async () => {
      try {
        // 클라이언트 측에서는 NEXT_PUBLIC_ 접두사가 있는 환경 변수만 접근 가능
        const status = {
          NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        }

        // 서버 측 환경 변수는 API를 통해 확인 (실제 값은 반환하지 않음)
        const response = await fetch("/api/check-env")
        const serverEnvStatus = await response.json()

        setEnvStatus({ ...status, ...serverEnvStatus })
      } catch (error) {
        console.error("환경 변수 확인 오류:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkEnvVariables()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>환경 변수 확인</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>환경 변수를 확인하는 중...</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(envStatus).map(([key, exists]) => (
                <div key={key} className="flex items-center justify-between p-2 border rounded-md">
                  <span className="font-mono text-sm">{key}</span>
                  {exists ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              ))}

              <div className="mt-4 p-4 bg-blue-50 rounded-md text-sm">
                <p className="font-medium text-blue-700 mb-2">환경 변수 설정 방법:</p>
                <ol className="list-decimal pl-5 space-y-1 text-blue-700">
                  <li>
                    프로젝트 루트에 <code>.env.local</code> 파일을 생성합니다.
                  </li>
                  <li>다음 환경 변수를 설정합니다:</li>
                  <li className="font-mono">NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</li>
                  <li className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</li>
                  <li className="font-mono">SUPABASE_SERVICE_ROLE_KEY=your_service_key</li>
                  <li>애플리케이션을 재시작합니다.</li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
