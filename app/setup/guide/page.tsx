import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function SetupGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center mt-8">학습 관리 시스템 구동 가이드</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. 환경 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Supabase 프로젝트 생성</h3>
                  <p className="text-sm text-gray-600">
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Supabase
                    </a>
                    에서 새 프로젝트를 생성하고 API 키를 확인합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">환경 변수 설정</h3>
                  <p className="text-sm text-gray-600">
                    프로젝트 루트에 <code>.env.local</code> 파일을 생성하고 필요한 환경 변수를 설정합니다.
                  </p>
                  <pre className="bg-gray-100 p-2 rounded-md mt-2 text-xs overflow-x-auto">
                    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
                    <br />
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
                    <br />
                    SUPABASE_SERVICE_ROLE_KEY=your_service_key
                  </pre>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Link href="/setup/env">
                  <Button variant="outline">환경 변수 확인</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. 데이터베이스 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">테이블 생성</h3>
                  <p className="text-sm text-gray-600">
                    Supabase SQL 에디터에서 테이블 생성 SQL을 실행합니다. (이미 완료됨)
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">기본 데이터 추가</h3>
                  <p className="text-sm text-gray-600">기본 과목 데이터와 관리자 계정을 추가합니다.</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4 mt-4">
                <Link href="/setup/subjects">
                  <Button variant="outline">과목 데이터 추가</Button>
                </Link>
                <Link href="/setup">
                  <Button variant="outline">관리자 계정 생성</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. 애플리케이션 실행</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">개발 모드 실행</h3>
                  <p className="text-sm text-gray-600">
                    터미널에서 다음 명령어를 실행하여 개발 모드로 애플리케이션을 시작합니다.
                  </p>
                  <pre className="bg-gray-100 p-2 rounded-md mt-2 text-xs">npm run dev</pre>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">프로덕션 빌드</h3>
                  <p className="text-sm text-gray-600">프로덕션 환경에 배포하기 위해 애플리케이션을 빌드합니다.</p>
                  <pre className="bg-gray-100 p-2 rounded-md mt-2 text-xs">
                    npm run build
                    <br />
                    npm start
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. 배포</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">Vercel 배포</h3>
                  <p className="text-sm text-gray-600">
                    <a
                      href="https://vercel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Vercel
                    </a>
                    에 프로젝트를 연결하고 환경 변수를 설정한 후 배포합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">다른 호스팅 서비스</h3>
                  <p className="text-sm text-gray-600">
                    Netlify, AWS, GCP 등 다른 호스팅 서비스에도 배포할 수 있습니다. 각 서비스의 가이드에 따라 환경
                    변수를 설정하세요.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Link href="/">
              <Button>시작 페이지로 이동</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
