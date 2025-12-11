/**
 * @file theme-toggle.tsx
 * @description 테마 전환 토글 버튼 컴포넌트
 *
 * 다크/라이트/시스템 테마 간 전환을 제공하는 버튼입니다.
 *
 * 주요 기능:
 * 1. Sun/Moon 아이콘으로 현재 테마 표시
 * 2. 클릭 시 테마 전환 (light → dark → system → light)
 * 3. 접근성 지원 (ARIA 라벨, 키보드 네비게이션)
 *
 * @dependencies
 * - next-themes: useTheme
 * - lucide-react: Sun, Moon, Monitor
 * - components/ui/button: Button
 */

'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * 테마 전환 토글 버튼 컴포넌트
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 렌더링 (hydration 불일치 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  // 테마 순환: light → dark → system → light
  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  // 현재 테마에 따른 아이콘 및 라벨
  const getThemeInfo = () => {
    if (!mounted) {
      return { icon: <Sun className="h-5 w-5" />, label: '테마 변경' };
    }

    if (theme === 'system') {
      return {
        icon: <Monitor className="h-5 w-5" aria-hidden="true" />,
        label: '시스템 테마 (클릭하여 라이트 모드로 변경)',
      };
    }

    if (resolvedTheme === 'dark') {
      return {
        icon: <Moon className="h-5 w-5" aria-hidden="true" />,
        label: '다크 모드 (클릭하여 시스템 테마로 변경)',
      };
    }

    return {
      icon: <Sun className="h-5 w-5" aria-hidden="true" />,
      label: '라이트 모드 (클릭하여 다크 모드로 변경)',
    };
  };

  const { icon, label } = getThemeInfo();

  // 마운트되기 전에는 플레이스홀더 렌더링
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        aria-label="테마 변경"
        disabled
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="h-9 w-9"
      aria-label={label}
      title={label}
    >
      {icon}
    </Button>
  );
}

