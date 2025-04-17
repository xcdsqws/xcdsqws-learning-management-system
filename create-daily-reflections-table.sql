-- 일일 학습 성찰 테이블 생성
CREATE TABLE IF NOT EXISTS daily_reflections (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reflection_date DATE NOT NULL,
  content TEXT NOT NULL,
  self_rating INTEGER NOT NULL CHECK (self_rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, reflection_date)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_daily_reflections_student_id ON daily_reflections(student_id);
CREATE INDEX IF NOT EXISTS idx_daily_reflections_date ON daily_reflections(reflection_date);
