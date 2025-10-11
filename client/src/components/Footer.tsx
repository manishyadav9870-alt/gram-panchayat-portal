import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'wouter';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('Quick Services', 'द्रुत सेवा')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/complaint" data-testid="link-footer-complaint">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('File Complaint', 'तक्रार नोंदवा')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services/birth-certificate" data-testid="link-footer-birth">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('Birth Certificate', 'जन्म दाखला')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services/death-certificate" data-testid="link-footer-death">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('Death Certificate', 'मृत्यू दाखला')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/track" data-testid="link-footer-track">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('Track Application', 'अर्ज ट्रॅक करा')}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t('Important Links', 'महत्वाचे दुवे')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" data-testid="link-footer-about">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('About Us', 'आमच्याबद्दल')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/services" data-testid="link-footer-services">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('All Services', 'सर्व सेवा')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/announcements" data-testid="link-footer-announcements">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('Announcements', 'घोषणा')}
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact" data-testid="link-footer-contact">
                  <span className="text-muted-foreground hover:text-foreground transition-colors">
                    {t('Contact Us', 'संपर्क')}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t('Contact Information', 'संपर्क माहिती')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {t('Gram Panchayat Office, Main Road', 'ग्रामपंचायत कार्यालय, मुख्य रस्ता')}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">+91 12345 67890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">info@grampanchayat.gov.in</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="text-muted-foreground">
                  <div>{t('Mon-Fri: 10:00 AM - 5:00 PM', 'सोम-शुक्र: १० ते ५')}</div>
                  <div>{t('Sat: 10:00 AM - 1:00 PM', 'शनिवार: १० ते १')}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>
            © 2024 {t('Gram Panchayat. All rights reserved.', 'ग्रामपंचायत. सर्व हक्क राखीव.')}
          </p>
        </div>
      </div>
    </footer>
  );
}
