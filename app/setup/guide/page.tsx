import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowRight } from "lucide-react"

export default function SetupGuidePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">학습 관리 시스템 설정 가이드</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">1. 환경 변수 설정</h2>
            <p>시스템이 올바르게 작동하려면 다음 환경 변수가 필요합니다:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <code className="bg-gray-100 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_URL</code>: Supabase 프로젝트 URL
              </li>
              <li>
                <code className="bg-gray-100 px-1 py-0.5 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>: Supabase 익명 키
              </li>
              <li>
                <code className="bg-gray-100 px-1 py-0.5 rounded">SUPABASE_SERVICE_ROLE_KEY</code>: Supabase 서비스 역할
                키
              </li>
            </ul>
            <div className="mt-4">
              <Link href="/setup/env">
                <Button>
                  환경 변수 확인하기 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">2. 데이터베이스 테이블 생성</h2>
            <p>시스템에 필요한 데이터베이스 테이블이 자동으로 생성됩니다. 다음 테이블이 필요합니다:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>users: 사용자 계정 정보</li>
              <li>subjects: 과목 정보</li>
              <li>study_logs: 학습 기록</li>
              <li>assignments: 과제 정보</li>
              <li>grades: 성적 정보</li>
              <li>reports: 학습 보고서</li>
              <li>notifications: 알림</li>
              <li>daily_reflections: 일일 학습 성찰</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">3. 기본 과목 설정</h2>
            <p>시스템에서 사용할 기본 과목을 설정합니다. 이 과목들은 학생들의 학습 기록, 과제, 성적 등에 사용됩니다.</p>
            <div className="mt-4">
              <Link href="/setup/subjects">
                <Button>
                  과목 설정하기 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">4. 관리자 계정 생성</h2>
            <p>
              시스템을 관리할 관리자 계정을 생성합니다. 관리자는 학생 계정 관리, 과목 관리, 성적 관리 등의 권한을
              갖습니다.
            </p>
            <div className="mt-4">
              <Link href="/setup">
                <Button>
                  관리자 계정 생성하기 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800">중요 안내</h3>
                <p className="text-yellow-700 mt-1">
                  설정이 완료된 후에는 보안을 위해 <code className="bg-yellow-100 px-1 py-0.5 rounded">/setup</code>{" "}
                  경로에 대한 접근을 제한하는 것이 좋습니다. 이는 Vercel 대시보드에서 환경 변수{" "}
                  <code className="bg-yellow-100 px-1 py-0.5 rounded">SETUP_ENABLED=false</code>로 설정하여 수행할 수
                  있습니다.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
