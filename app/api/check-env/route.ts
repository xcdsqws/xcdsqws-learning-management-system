import { NextResponse } from "next/server"

export async function GET() {
  // 서버 측 환경 변수 존재 여부만 확인 (실제 값은 반환하지 않음)
  const serverEnvStatus = {
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  return NextResponse.json(serverEnvStatus)
}
