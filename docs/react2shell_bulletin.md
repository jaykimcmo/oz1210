# React2Shell Security Bulletin (Complete Summary)

> **출처:** Vercel Knowledge Base — React2Shell Bulletin  
> **위험도:** ⭐ Critical (CVSS 10.0)  
> **업데이트일:** 2025-12-09  
> **요약:** React Server Components(RSC) 취약점으로 인해 **원격 코드 실행(RCE)** 이 가능한 심각한 보안 이슈

---

## 📌 1. 개요

React2Shell은 **React Server Components(RSC)** 의 역직렬화(deserialization) 취약점을 악용해  
**원격 코드 실행(Remote Code Execution)** 이 가능하게 만드는 치명적 보안 문제이다.

2025년 12월, **실제 익스플로잇 코드가 공개되며 심각성이 급격히 증가**했다.  
Vercel은 WAF 룰을 제공하지만 이는 **부분적인 방어**이며, **패치 업데이트가 필수**다.

---

## ⚠️ 2. 영향을 받는 환경

### ✓ Next.js (패치 필요)
다음 버전들은 React2Shell 취약점에 영향을 받음:

- Next.js **15.0.0 ~ 16.0.6**
- Next.js **14 canary (14.3.0-canary.76 이후)**

### ✓ React Server Components 기반 프레임워크
React 19 + RSC를 사용하는 모든 프레임워크는 영향을 받을 가능성이 있음.

Vercel Dashboard에서 취약 패키지를 자동 감지하며 경고를 표시함.

---

## 🚨 3. 취약 상세 (CVE 정보)

### **CVE-2025-55182**
- RSC 내부의 **안전하지 않은 역직렬화** 문제  
- 특수한 페이로드를 통해 공격자가 서버에서 임의 코드를 실행할 수 있음

### **CVE-2025-66478**
- Next.js App Router 관련 추가 취약점  
- 마찬가지로 즉각 업데이트가 필요

---

## 🛠️ 4. 대응 방법 (Patch & Tools)

### 4-1) Next.js 패치 버전 업데이트

아래 버전으로 업그레이드하면 즉시 해결됨:

| 기존 버전 | 업데이트해야 할 버전 |
|----------|-----------------------|
| 15.0.x | → **15.0.5** |
| 15.1.x | → **15.1.9** |
| 15.2.x | → **15.2.6** |
| 15.3.x | → **15.3.6** |
| 15.4.x | → **15.4.8** |
| 15.5.x | → **15.5.7** |
| 16.0.x | → **16.0.7** |

Canary 버전도 반드시 최신 패치 버전으로 업데이트 필요.

---

### 4-2) 자동 패치 도구 사용

#### **Vercel Agent**
- 취약점 자동 탐지  
- 자동 Pull Request 생성  
- 대규모 프로젝트에 권장

#### **CLI 툴**

npx fix-react2shell-next

→ Next.js 프로젝트에서 취약 패키지를 자동 교체 및 패치

---

### 4-3) 환경 변수(Secrets) 재발급 권장

취약 버전을 사용한 적이 있다면 다음 수행:

- API Keys, DB Password 등 **환경변수 rotate(재발급)**  
- 특히 **NEXTAUTH_SECRET**, **SUPABASE_SERVICE_ROLE_KEY** 등 민감 키는 반드시 재발급

---

### 4-4) 배포 보호(Deployment Protection)

Vercel에서 다음 기능을 활성화하면 추가적인 보호 가능:

- Deployment Protection  
- Web Application Firewall (WAF) rules  
- 프로젝트 내 취약 패키지 자동 경고 표시

---

## 🔍 5. 취약 여부 확인 방법

### 방법 1) Vercel Dashboard
- “Security Issues” 영역에 취약 패키지가 자동 감지되어 표시됨

### 방법 2) 프로젝트 직접 확인
`package.json` 확인:

- `"next": "15.x.x"`  
- `"react-server-dom-webpack"` 등 RSC 관련 패키지 버전 확인

### 방법 3) CLI 검사

npx fix-react2shell-next --check


---

## ❓ 6. FAQ

### Q. WAF만 적용하면 안전한가요?
→ **아니요.**  
WAF는 일부 패턴만 차단할 뿐, **100% 보호하지 못함**.  
**버전 업데이트가 필수 해결책**임.

### Q. 실제 공격 사례가 있나요?
→ 예. 2025년 12월 **공개된 PoC(Proof of Concept) 익스플로잇 코드**가 있어  
공격 위험이 매우 높음.

### Q. 패치 후 해야 할 일은?
- 환경 변수 재발급  
- 의심되는 로그 검사  
- 재배포 후 정상 동작 확인

---

## 📚 7. 공식 참고 자료 (Reference)

아래는 Vercel이 명시한 **모든 참고 링크 정리본**:

### 🔗 Vercel 공식 문서
- React2Shell Bulletin  
  https://vercel.com/kb/bulletin/react2shell  

- Updating Next.js  
  https://nextjs.org/docs/app/building-your-application/updating-nextjs  

- Vercel Security Features  
  https://vercel.com/docs/security  

- Vercel Web Application Firewall (WAF)  
  https://vercel.com/docs/security/web-application-firewall  

- Deployment Protection Rules  
  https://vercel.com/docs/security/deployment-protection  

---

## 📖 8. 관련 CVEs

- CVE-2025-55182 — React Server Components unsafe deserialization  
- CVE-2025-66478 — Next.js App Router RSC related issue  

---

## ✅ 9. 요약

React2Shell은 최근 가장 심각한 RSC 기반 취약점 중 하나로,  
**Next.js 프로젝트를 운영 중이라면 반드시 즉시 업데이트해야 한다.**

- 서버 권한 탈취 가능  
- 공개 익스플로잇 존재  
- 패치 + 환경변수 재발급 + 재배포는 필수

---
추가로 아래 링크도 참고해 주세요

순번	링크 텍스트	URL
1	CVE-2025-55182	https://www.cve.org/CVERecord?id=CVE-2025-55182

2	CVE-2025-66478	https://github.com/CVE-2025-66478

3	Vercel Developers X Account	https://x.com/verceldevs

4	Next.js 공식	https://nextjs.org/

5	Vercel Dashboard	https://vercel.com/

6	Vercel Docs	https://vercel.com/docs

7	Vercel Security Actions Dashboard	https://vercel.com/dashboard/security/actions

8	Deployment Protection Settings	https://vercel.com/dashboard/settings/deployment-protection

9	Vercel Agent (필터)	https://vercel.com/dashboard/security/actions?filter=agent

10	fix-react2shell-next GitHub	https://github.com/vercel-labs/fix-react2shell-next

11	Vercel 환경 변수 Docs	https://vercel.com/docs/environment-variables

12	Next.js CVE-2025-66478 Advisory	https://nextjs.org/blog/CVE-2025-66478

13	React 보안 공지 (react.dev)	https://react.dev/security/advisory/react2shell

14	fix-react2shell-next (npm)	https://www.npmjs.com/package/fix-react2shell-next

15	HackerOne	https://hackerone.com/