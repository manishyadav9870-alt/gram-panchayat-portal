import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageToggle from './LanguageToggle';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  const navItems = [
    { path: '/', labelEn: 'Home', labelMr: 'मुख्यपृष्ठ' },
    { path: '/about', labelEn: 'About', labelMr: 'आमच्याबद्दल' },
    { path: '/services', labelEn: 'Services', labelMr: 'सेवा' },
    { path: '/announcements', labelEn: 'Announcements', labelMr: 'घोषणा' },
    { path: '/track', labelEn: 'Track Application', labelMr: 'अर्ज ट्रॅक करा' },
    { path: '/contact', labelEn: 'Contact', labelMr: 'संपर्क' },
  ];

  const adminNavItems = user ? [
    ...navItems,
    { path: '/admin/dashboard', labelEn: 'Admin', labelMr: 'प्रशासक' },
  ] : navItems;

  return (
    <header className="sticky top-0 z-50 glass-header shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-xl px-3 py-2 -ml-3 transition-all duration-300 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-white shadow-lg group-hover:shadow-primary/50 transition-shadow">
                <span className="text-base font-bold">कि.ग्रा.प.</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gradient">{t('Kishore Gram Panchayat', 'किशोर ग्रामपंचायत')}</h1>
                <p className="text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-chart-2 to-chart-3">
                  {t('Digital Services', 'डिजिटल सेवा')}
                </p>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {adminNavItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-${item.labelEn.toLowerCase().replace(' ', '-')}`}>
                <Button
                  variant={location === item.path ? 'secondary' : 'ghost'}
                  size="sm"
                  className={`rounded-lg font-medium transition-all duration-300 ${
                    location === item.path 
                      ? 'bg-gradient-to-r from-primary/10 to-chart-3/10 border border-primary/20 shadow-md' 
                      : 'hover-elevate hover:bg-primary/5'
                  }`}
                >
                  {t(item.labelEn, item.labelMr)}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            
            {/* Login/Logout Button */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg hover:bg-primary/10"
                  onClick={() => setLocation('/admin/dashboard')}
                >
                  <User className="h-4 w-4 mr-2" />
                  {user.username}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('Logout', 'बाहेर पडा')}
                </Button>
              </div>
            ) : (
              <Link href="/admin/login">
                <Button
                  variant="default"
                  size="sm"
                  className="hidden md:flex rounded-lg gradient-primary hover-elevate"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('Admin Login', 'प्रशासक लॉगिन')}
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-lg hover:bg-primary/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-white/10 py-4 space-y-2 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path} data-testid={`link-mobile-${item.labelEn.toLowerCase().replace(' ', '-')}`}>
                <Button
                  variant={location === item.path ? 'secondary' : 'ghost'}
                  size="sm"
                  className={`w-full justify-start rounded-lg font-medium transition-all ${
                    location === item.path
                      ? 'bg-gradient-to-r from-primary/10 to-chart-3/10 border border-primary/20'
                      : 'hover:bg-primary/5'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(item.labelEn, item.labelMr)}
                </Button>
              </Link>
            ))}
            
            {/* Mobile Login/Logout */}
            <div className="pt-2 border-t border-white/10">
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start rounded-lg mb-2"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLocation('/admin/dashboard');
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {user.username}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start rounded-lg"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('Logout', 'बाहेर पडा')}
                  </Button>
                </>
              ) : (
                <Link href="/admin/login">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full justify-start rounded-lg gradient-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {t('Admin Login', 'प्रशासक लॉगिन')}
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
