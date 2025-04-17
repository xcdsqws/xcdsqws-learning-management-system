import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 환경 변수 확인
    const supabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY

    return NextResponse.json({
      supabaseUrl,
      supabaseAnonKey,
      supabaseServiceKey,
    })
  } catch (error: any) {
    console.error("환경 변수 확인 오류:", error)
    return NextResponse.json({ error: error.message || "환경 변수 확인 중 오류가 발생했습니다." }, { status: 500 })
  }
}
