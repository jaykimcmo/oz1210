'use client';

import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: '홈' },
    { href: '/stats', label: '통계' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-4" aria-label="메인 네비게이션">
        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold transition-colors hover:text-primary"
          aria-label="My Trip 홈으로 이동"
        >
          My Trip
        </Link>

        {/* 데스크톱 네비게이션 */}
        <div className="hidden lg:flex lg:items-center lg:gap-6">
          {/* 검색 아이콘 (검색 영역으로 스크롤) */}
          <a
            href="#search-section"
            className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="검색 영역으로 이동"
          >
            <Search className="h-5 w-5" />
          </a>

          {/* 네비게이션 링크 */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* 북마크 링크 (로그인한 사용자만) */}
            <SignedIn>
              <Link
                href="/bookmarks"
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/bookmarks')
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                북마크
              </Link>
            </SignedIn>
          </div>

          {/* 인증 버튼 */}
          <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="default" size="sm">
                  로그인
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* 검색 아이콘 (검색 영역으로 스크롤) */}
          <a
            href="#search-section"
            className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="검색 영역으로 이동"
          >
            <Search className="h-5 w-5" />
          </a>

          {/* 인증 버튼 (모바일) */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm" className="h-9">
                로그인
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="h-9 w-9">
              <UserButton />
            </div>
          </SignedIn>

          {/* 햄버거 메뉴 */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                aria-label="메뉴 열기"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">메뉴 토글</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>메뉴</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-2" aria-label="모바일 네비게이션">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-md px-4 py-3 text-base font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* 북마크 링크 (로그인한 사용자만) */}
                <SignedIn>
                  <Link
                    href="/bookmarks"
                    onClick={() => setIsMenuOpen(false)}
                    className={`rounded-md px-4 py-3 text-base font-medium transition-colors ${
                      isActive('/bookmarks')
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    북마크
                  </Link>
                </SignedIn>

                {/* 로그인/로그아웃 버튼 (모바일 메뉴 내부) */}
                <div className="mt-4 border-t pt-4">
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button variant="default" className="w-full" onClick={() => setIsMenuOpen(false)}>
                        로그인
                      </Button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-muted-foreground">계정</span>
                      <UserButton />
                    </div>
                  </SignedIn>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
