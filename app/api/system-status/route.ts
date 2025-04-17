import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    // 데이터베이스 연결 확인
    const { data: dbStatus, error: dbError } = await supabaseAdmin.from("subjects").select("count()").limit(1).single()

    if (dbError) {
      throw new Error("데이터베이스 연결 오류")
    }

    // 환경 변수 확인
    const envStatus = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    // 시스템 상태 반환
    return NextResponse.json({
      status: "ok",
      database: "connected",
      environment: envStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("시스템 상태 확인 오류:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "시스템 상태 확인 중 오류가 발생했습니다.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
