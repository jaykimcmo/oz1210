# 환경변수 설정 가이드

> **프로젝트:** My Trip (oz1210)  
> **작성일:** 2025-12-11

---

## 1. 환경변수 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 아래 내용을 복사하세요.

```bash
# =============================================================================
# My Trip 환경변수 설정
# =============================================================================

# -----------------------------------------------------------------------------
# Clerk Authentication (필수)
# https://dashboard.clerk.com 에서 발급
# -----------------------------------------------------------------------------
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key

# Clerk 라우트 설정
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# -----------------------------------------------------------------------------
# Supabase Database (필수)
# https://supabase.com/dashboard 에서 확인
# Settings > API > Project URL, Project API keys
# -----------------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Service Role Key (서버 사이드 전용, 절대 클라이언트에 노출 금지)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Storage 버킷 이름
NEXT_PUBLIC_STORAGE_BUCKET=uploads

# -----------------------------------------------------------------------------
# 한국관광공사 Tour API (필수)
# https://api.visitkorea.or.kr 에서 발급
# -----------------------------------------------------------------------------
# 클라이언트 사이드용 (공개 가능)
NEXT_PUBLIC_TOUR_API_KEY=your_tour_api_key

# 서버 사이드용 (동일한 키 사용 가능)
TOUR_API_KEY=your_tour_api_key

# -----------------------------------------------------------------------------
# Naver Maps API (필수)
# https://console.ncloud.com/naver-service/application 에서 발급
# Web Dynamic Map 서비스 등록 필요
# -----------------------------------------------------------------------------
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_naver_map_client_id

# -----------------------------------------------------------------------------
# Application URL (필수)
# 개발: http://localhost:3000
# 프로덕션: https://your-domain.vercel.app
# -----------------------------------------------------------------------------
NEXT_PUBLIC_APP_URL=http://localhost:3000

# -----------------------------------------------------------------------------
# Sentry Error Tracking (선택)
# https://sentry.io 에서 프로젝트 생성 후 발급
# 설정하지 않으면 에러 추적이 비활성화됩니다.
# -----------------------------------------------------------------------------
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
```

---

## 2. 환경변수 상세 설명

### 2.1 Clerk Authentication

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk 공개 키 |
| `CLERK_SECRET_KEY` | ✅ | Clerk 비밀 키 (서버 전용) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | ✅ | 로그인 페이지 경로 |

**발급 방법:**
1. [Clerk Dashboard](https://dashboard.clerk.com) 접속
2. 애플리케이션 선택 또는 생성
3. API Keys 메뉴에서 키 확인

### 2.2 Supabase Database

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | 익명 접근용 API 키 |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | 관리자 권한 키 (서버 전용) |
| `NEXT_PUBLIC_STORAGE_BUCKET` | ✅ | Storage 버킷 이름 |

**발급 방법:**
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. Settings > API 메뉴에서 확인

> ⚠️ **주의:** `SUPABASE_SERVICE_ROLE_KEY`는 RLS를 우회하므로 절대 클라이언트에 노출하지 마세요.

### 2.3 한국관광공사 Tour API

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `NEXT_PUBLIC_TOUR_API_KEY` | ✅ | 클라이언트용 API 키 |
| `TOUR_API_KEY` | ✅ | 서버용 API 키 |

**발급 방법:**
1. [한국관광공사 Open API](https://api.visitkorea.or.kr) 접속
2. 회원가입 및 로그인
3. 마이페이지 > 인증키 발급

### 2.4 Naver Maps API

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` | ✅ | 네이버 지도 Client ID |

**발급 방법:**
1. [Naver Cloud Platform](https://console.ncloud.com) 접속
2. AI·NAVER API > Application 등록
3. Web Dynamic Map 서비스 선택
4. 등록 도메인에 `localhost` 및 프로덕션 도메인 추가

### 2.5 Sentry (선택)

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `NEXT_PUBLIC_SENTRY_DSN` | ❌ | Sentry 프로젝트 DSN |
| `SENTRY_ORG` | ❌ | Sentry 조직 이름 |
| `SENTRY_PROJECT` | ❌ | Sentry 프로젝트 이름 |
| `SENTRY_AUTH_TOKEN` | ❌ | 소스맵 업로드용 토큰 |

**발급 방법:**
1. [Sentry](https://sentry.io) 접속
2. 프로젝트 생성 (Next.js 선택)
3. DSN 확인
4. Settings > Auth Tokens에서 토큰 생성

---

## 3. Vercel 배포 시 환경변수 설정

### 3.1 설정 방법

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** > **Environment Variables**
4. 환경변수 하나씩 추가

### 3.2 Environment 선택

| Environment | 용도 |
|-------------|------|
| Production | 프로덕션 배포 |
| Preview | PR 미리보기 배포 |
| Development | 로컬 개발 (vercel dev 사용 시) |

### 3.3 필수 환경변수 체크리스트

```
✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
✅ CLERK_SECRET_KEY
✅ NEXT_PUBLIC_CLERK_SIGN_IN_URL
✅ NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
✅ NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ NEXT_PUBLIC_STORAGE_BUCKET
✅ NEXT_PUBLIC_TOUR_API_KEY
✅ TOUR_API_KEY
✅ NEXT_PUBLIC_NAVER_MAP_CLIENT_ID
✅ NEXT_PUBLIC_APP_URL (프로덕션 도메인으로 변경)
```

### 3.4 프로덕션 배포 시 주의사항

1. **`NEXT_PUBLIC_APP_URL`** 을 실제 프로덕션 도메인으로 변경
   - 예: `https://my-trip.vercel.app`

2. **Naver Maps 도메인 등록**
   - Naver Cloud Console에서 프로덕션 도메인 추가

3. **Clerk 도메인 설정**
   - Clerk Dashboard에서 프로덕션 도메인 추가

---

## 4. 보안 주의사항

### 4.1 절대 노출하면 안 되는 키

| 변수명 | 위험도 |
|--------|--------|
| `CLERK_SECRET_KEY` | 🔴 Critical |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔴 Critical |
| `SENTRY_AUTH_TOKEN` | 🟡 Medium |

### 4.2 안전한 키 관리 방법

1. `.env` 파일은 절대 Git에 커밋하지 않기 (`.gitignore`에 포함됨)
2. 프로덕션 키는 Vercel Dashboard에서만 관리
3. 팀원 간 키 공유 시 암호화된 채널 사용
4. 정기적으로 키 로테이션 (특히 보안 사고 발생 시)

---

## 5. 문제 해결

### 5.1 환경변수가 인식되지 않을 때

```bash
# 개발 서버 재시작
pnpm dev

# 캐시 삭제 후 재시작
rm -rf .next
pnpm dev
```

### 5.2 Vercel 배포 후 환경변수 오류

1. Vercel Dashboard에서 환경변수 확인
2. 재배포 실행 (Deployments > Redeploy)
3. 함수 로그 확인 (Functions > Logs)

### 5.3 NEXT_PUBLIC_ 접두사 관련

- `NEXT_PUBLIC_` 접두사가 있는 변수만 클라이언트에서 접근 가능
- 서버 전용 변수에는 이 접두사를 사용하지 않음

