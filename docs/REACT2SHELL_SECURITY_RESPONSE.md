# React2Shell 보안 취약점 대응 보고서

> **작성일:** 2025-12-11  
> **프로젝트:** My Trip (oz1210)  
> **작성자:** AI Assistant (Claude)

---

## 1. 취약점 개요

### 1.1 React2Shell이란?

React2Shell은 **React Server Components(RSC)** 의 역직렬화(deserialization) 취약점을 악용하여 **원격 코드 실행(Remote Code Execution, RCE)** 이 가능하게 만드는 치명적인 보안 문제입니다.

2025년 12월, 실제 익스플로잇 코드가 공개되면서 심각성이 급격히 증가했습니다.

### 1.2 관련 CVE

| CVE 번호 | 설명 | 심각도 |
|----------|------|--------|
| CVE-2025-55182 | RSC 내부의 안전하지 않은 역직렬화 문제 | Critical (CVSS 10.0) |
| CVE-2025-66478 | Next.js App Router RSC 관련 추가 취약점 | Critical |

### 1.3 영향을 받는 버전

| 프레임워크 | 취약 버전 | 패치 버전 |
|------------|----------|----------|
| Next.js 15.0.x | 15.0.0 ~ 15.0.4 | **15.0.5** |
| Next.js 15.1.x | 15.1.0 ~ 15.1.8 | **15.1.9** |
| Next.js 15.2.x | 15.2.0 ~ 15.2.5 | **15.2.6** |
| Next.js 15.3.x | 15.3.0 ~ 15.3.5 | **15.3.6** |
| Next.js 15.4.x | 15.4.0 ~ 15.4.7 | **15.4.8** |
| Next.js 15.5.x | 15.5.0 ~ 15.5.6 | **15.5.7** |
| Next.js 16.0.x | 16.0.0 ~ 16.0.6 | **16.0.7** |

---

## 2. 현재 프로젝트 영향도 분석

### 2.1 프로젝트 의존성 현황

```json
{
  "dependencies": {
    "next": "15.5.7",
    "react": "19.2.1",
    "react-dom": "19.2.1"
  }
}
```

### 2.2 취약점 검사 결과

**검사 도구:** `fix-react2shell-next` (Vercel 공식 CLI 도구)

**검사 명령어:**
```bash
npx fix-react2shell-next --check
```

**검사 결과:**
```
🔍 fix-react2shell-next - CVE-2025-66478 vulnerability scanner

📂 Found 1 package.json file(s)

✓ No vulnerable packages found!
  Your project is not affected by CVE-2025-66478.
```

### 2.3 결론

| 항목 | 상태 | 비고 |
|------|------|------|
| Next.js 버전 | ✅ 안전 | 15.5.7 (패치됨) |
| React 버전 | ✅ 안전 | 19.2.1 (최신) |
| 취약점 검사 | ✅ 통과 | CVE-2025-66478 영향 없음 |
| 전체 상태 | ✅ **배포 가능** | 추가 조치 불필요 |

---

## 3. 검증 방법

### 3.1 버전 확인

```bash
# package.json에서 직접 확인
cat package.json | grep "next"

# pnpm으로 설치된 버전 확인
pnpm list next react react-dom --depth=0
```

### 3.2 취약점 검사 도구 실행

```bash
# 취약점 검사 (읽기 전용)
npx fix-react2shell-next --check

# 취약점 자동 수정 (필요한 경우)
npx fix-react2shell-next
```

### 3.3 Vercel Dashboard 확인

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. "Security Issues" 섹션에서 취약 패키지 경고 확인
4. 경고가 없으면 안전

---

## 4. 향후 보안 유지 가이드

### 4.1 정기 점검 항목

1. **패키지 업데이트 모니터링**
   - Next.js 보안 공지 확인: https://nextjs.org/blog
   - Vercel 보안 게시판 확인: https://vercel.com/kb/bulletin

2. **취약점 검사 주기**
   - 배포 전 반드시 `npx fix-react2shell-next --check` 실행
   - 주 1회 정기 검사 권장

3. **의존성 업데이트**
   ```bash
   # 보안 패치 확인
   pnpm audit
   
   # Next.js 업데이트
   pnpm update next
   ```

### 4.2 환경변수 보안

취약 버전을 사용한 적이 있다면 다음 환경변수를 재발급해야 합니다:

| 환경변수 | 재발급 필요 여부 | 재발급 방법 |
|----------|-----------------|------------|
| `CLERK_SECRET_KEY` | 권장 | Clerk Dashboard에서 재생성 |
| `SUPABASE_SERVICE_ROLE_KEY` | 권장 | Supabase Dashboard에서 재생성 |
| `TOUR_API_KEY` | 선택 | 한국관광공사에서 재발급 |
| `SENTRY_AUTH_TOKEN` | 선택 | Sentry Dashboard에서 재생성 |

> **참고:** 현재 프로젝트는 취약 버전을 사용한 적이 없으므로 환경변수 재발급은 필수가 아닙니다.

### 4.3 Vercel 배포 보호 설정

1. **Deployment Protection 활성화**
   - Vercel Dashboard → Settings → Deployment Protection
   - Preview 배포에 대한 인증 요구 설정

2. **WAF (Web Application Firewall) 활성화**
   - Vercel Pro 이상 플랜에서 사용 가능
   - 추가적인 보안 레이어 제공

---

## 5. 참고 자료

### 5.1 공식 문서

- [Vercel React2Shell Bulletin](https://vercel.com/kb/bulletin/react2shell)
- [Next.js CVE-2025-66478 Advisory](https://nextjs.org/blog/CVE-2025-66478)
- [React Security Advisory](https://react.dev/security/advisory/react2shell)

### 5.2 도구

- [fix-react2shell-next (npm)](https://www.npmjs.com/package/fix-react2shell-next)
- [fix-react2shell-next (GitHub)](https://github.com/vercel-labs/fix-react2shell-next)

### 5.3 CVE 정보

- [CVE-2025-55182](https://www.cve.org/CVERecord?id=CVE-2025-55182)
- [CVE-2025-66478](https://github.com/CVE-2025-66478)

---

## 6. 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2025-12-11 | 1.0 | 최초 작성, 보안 검증 완료 |

---

## 7. 결론

현재 프로젝트는 **Next.js 15.5.7**을 사용하고 있어 React2Shell 취약점(CVE-2025-55182, CVE-2025-66478)에 영향을 받지 않습니다.

Vercel 공식 검사 도구를 통해 취약점이 없음을 확인했으며, 안전하게 프로덕션 배포를 진행할 수 있습니다.

향후 Next.js 업데이트 시에는 보안 공지를 확인하고, 정기적으로 취약점 검사를 수행하여 보안 상태를 유지하시기 바랍니다.

