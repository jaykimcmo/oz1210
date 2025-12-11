/**
 * @file theme-provider.tsx
 * @description 테마 프로바이더 컴포넌트
 *
 * next-themes를 래핑하여 다크/라이트 모드 전환 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 시스템 테마 감지
 * 2. 사용자 선택 테마 저장 (localStorage)
 * 3. 테마 전환 시 부드러운 전환
 *
 * @dependencies
 * - next-themes: ThemeProvider
 */

'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

/**
 * 테마 프로바이더 컴포넌트
 *
 * @param children - 자식 컴포넌트
 * @param props - next-themes ThemeProvider props
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

