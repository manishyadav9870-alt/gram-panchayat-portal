import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Award, Target } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

  const members = [
    { nameEn: 'Ramesh Patil', nameMr: 'रमेश पाटील', roleEn: 'Sarpanch', roleMr: 'सरपंच' },
    { nameEn: 'Sunita Deshmukh', nameMr: 'सुनिता देशमुख', roleEn: 'Deputy Sarpanch', roleMr: 'उपसरपंच' },
    { nameEn: 'Mohan Shinde', nameMr: 'मोहन शिंदे', roleEn: 'Member', roleMr: 'सदस्य' },
    { nameEn: 'Savita Jadhav', nameMr: 'सविता जाधव', roleEn: 'Member', roleMr: 'सदस्य' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {t('About Kishore Gram Panchayat', 'किशोर ग्रामपंचायत बद्दल')}
          </h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                {t('Our Mission', 'आमचे ध्येय')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t(
                  'Our mission is to provide efficient and transparent governance to all citizens. We are committed to delivering quality services, ensuring rapid resolution of grievances, and fostering inclusive development in our village.',
                  'आमचे ध्येय सर्व नागरिकांना कार्यक्षम आणि पारदर्शक प्रशासन प्रदान करणे आहे. आम्ही दर्जेदार सेवा देण्यास, तक्रारींचे जलद निराकरण करण्यास आणि आमच्या गावात सर्वसमावेशक विकास करण्यास वचनबद्ध आहोत.'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                {t('Our Vision', 'आमची दृष्टी')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t(
                  'To build a progressive, self-reliant village where every citizen has access to basic amenities, quality education, healthcare, and economic opportunities. We envision a digitally empowered community that preserves its cultural heritage while embracing modern development.',
                  'एक प्रगतीशील, स्वावलंबी गाव तयार करणे जिथे प्रत्येक नागरिकाला मूलभूत सुविधा, दर्जेदार शिक्षण, आरोग्यसेवा आणि आर्थिक संधी उपलब्ध असतील. आधुनिक विकासाला स्वीकारताना आपला सांस्कृतिक वारसा जपणाऱ्या डिजिटल सशक्त समुदायाची आम्ही कल्पना करतो.'
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                {t('Panchayat Members', 'पंचायत सदस्य')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-4 p-4 rounded-lg border hover-elevate"
                    data-testid={`member-${index}`}
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t(member.nameEn, member.nameMr)}</h3>
                      <p className="text-sm text-muted-foreground">{t(member.roleEn, member.roleMr)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
