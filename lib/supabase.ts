import { createClient } from "@supabase/supabase-js"

// 환경 변수에서 Supabase URL과 키 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

// 서버 컴포넌트에서 사용할 클라이언트 (관리자 권한)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// 클라이언트 컴포넌트에서 사용할 싱글톤 인스턴스 생성 함수
let clientInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey)
  }
  return clientInstance
}
