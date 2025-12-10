import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* 저작권 및 링크 */}
          <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground md:flex-row md:gap-4">
            <p>My Trip © 2025</p>
            <div className="flex gap-4">
              <Link
                href="/"
                className="transition-colors hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="/"
                className="transition-colors hover:text-foreground"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* API 출처 */}
          <p className="text-sm text-muted-foreground">
            한국관광공사 API 제공
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

