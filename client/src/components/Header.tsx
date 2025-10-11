import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', labelEn: 'Home', labelMr: 'मुख्यपृष्ठ' },
    { path: '/about', labelEn: 'About', labelMr: 'आमच्याबद्दल' },
    { path: '/services', labelEn: 'Services', labelMr: 'सेवा' },
    { path: '/announcements', labelEn: 'Announcements', labelMr: 'घोषणा' },
    { path: '/track', labelEn: 'Track Application', labelMr: 'अर्ज ट्रॅक करा' },
    { path: '/contact', labelEn: 'Contact', labelMr: 'संपर्क' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-lg font-bold">ग्रा.प.</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold">{t('Gram Panchayat', 'ग्रामपंचायत')}</h1>
                <p className="text-xs text-muted-foreground">{t('Digital Services', 'डिजिटल सेवा')}</p>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-${item.labelEn.toLowerCase().replace(' ', '-')}`}>
                <Button
                  variant={location === item.path ? 'secondary' : 'ghost'}
                  size="sm"
                  className={location === item.path ? '' : 'hover-elevate'}
                >
                  {t(item.labelEn, item.labelMr)}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden border-t py-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-mobile-${item.labelEn.toLowerCase().replace(' ', '-')}`}>
                <Button
                  variant={location === item.path ? 'secondary' : 'ghost'}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(item.labelEn, item.labelMr)}
                </Button>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
