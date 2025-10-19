import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Award, Target, Sparkles, MapPin, Phone, Mail, Calendar, TrendingUp, Building2, Heart } from 'lucide-react';

export default function About() {
  const { t } = useLanguage();

  const members = [
    { nameEn: 'Ramesh Patil', nameMr: 'रमेश पाटील', roleEn: 'Sarpanch', roleMr: 'सरपंच' },
    { nameEn: 'Sunita Deshmukh', nameMr: 'सुनिता देशमुख', roleEn: 'Deputy Sarpanch', roleMr: 'उपसरपंच' },
    { nameEn: 'Mohan Shinde', nameMr: 'मोहन शिंदे', roleEn: 'Member', roleMr: 'सदस्य' },
    { nameEn: 'Savita Jadhav', nameMr: 'सविता जाधव', roleEn: 'Member', roleMr: 'सदस्य' },
  ];

  const stats = [
    { icon: Users, labelEn: 'Population', labelMr: 'लोकसंख्या', value: '5,000+', color: 'from-blue-500 to-cyan-500' },
    { icon: Building2, labelEn: 'Households', labelMr: 'घरे', value: '1,200+', color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, labelEn: 'Growth Rate', labelMr: 'वाढ दर', value: '12%', color: 'from-green-500 to-emerald-500' },
    { icon: Heart, labelEn: 'Satisfaction', labelMr: 'समाधान', value: '95%', color: 'from-orange-500 to-red-500' },
  ];

  const achievements = [
    { year: '2024', titleEn: 'Digital Transformation', titleMr: 'डिजिटल परिवर्तन', descEn: 'Launched online portal for all services', descMr: 'सर्व सेवांसाठी ऑनलाइन पोर्टल सुरू केले' },
    { year: '2023', titleEn: 'Clean Village Award', titleMr: 'स्वच्छ गाव पुरस्कार', descEn: 'Received state-level recognition', descMr: 'राज्यस्तरीय मान्यता मिळाली' },
    { year: '2022', titleEn: 'Infrastructure Development', titleMr: 'पायाभूत सुविधा विकास', descEn: 'Completed road and water projects', descMr: 'रस्ते आणि पाणी प्रकल्प पूर्ण केले' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 -left-20 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-orange-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-100/20 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="text-center mb-16 animate-slide-up">
              <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-white/80 backdrop-blur-md border border-orange-200/50 shadow-lg hover:shadow-xl transition-shadow">
                <Sparkles className="h-4 w-4 text-orange-600 animate-pulse" />
                <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  {t('Know Your Panchayat', 'आपले पंचायत ओळखा')}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 via-orange-700 to-gray-900 bg-clip-text text-transparent">
                {t('About Kishore Gram Panchayat', 'किशोर ग्रामपंचायत बद्दल')}
              </h1>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="relative overflow-hidden border-2 border-gray-200/60 hover:border-orange-300 rounded-3xl transition-all duration-500 group hover:shadow-2xl hover:-translate-y-2">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                    <CardContent className="p-6 relative">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="text-4xl font-bold mb-1 text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600 font-semibold">{t(stat.labelEn, stat.labelMr)}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-gradient-to-b from-gray-50/50 to-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="space-y-8">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/60 rounded-3xl overflow-hidden group hover:border-orange-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <CardHeader className="relative pt-6">
                  <CardTitle className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <Target className="h-10 w-10" />
                    </div>
                    <span className="text-2xl md:text-3xl font-bold text-gray-900">{t('Our Mission', 'आमचे ध्येय')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative pb-6">
                  <div className="bg-white/60 rounded-xl p-4">
                    <p className="text-gray-700 text-base leading-relaxed font-medium">
                    {t(
                      'Our mission is to provide efficient and transparent governance to all citizens. We are committed to delivering quality services, ensuring rapid resolution of grievances, and fostering inclusive development in our village.',
                      'आमचे ध्येय सर्व नागरिकांना कार्यक्षम आणि पारदर्शक प्रशासन प्रदान करणे आहे. आम्ही दर्जेदार सेवा देण्यास, तक्रारींचे जलद निराकरण करण्यास आणि आमच्या गावात सर्वसमावेशक विकास करण्यास वचनबद्ध आहोत.'
                    )}
                  </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200/60 rounded-3xl overflow-hidden group hover:border-orange-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <Award className="h-8 w-8" />
                    </div>
                    <span className="text-2xl md:text-3xl font-bold">{t('Our Vision', 'आमची दृष्टी')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {t(
                      'To build a progressive, self-reliant village where every citizen has access to basic amenities, quality education, healthcare, and economic opportunities. We envision a digitally empowered community that preserves its cultural heritage while embracing modern development.',
                      'एक प्रगतीशील, स्वावलंबी गाव तयार करणे जिथे प्रत्येक नागरिकाला मूलभूत सुविधा, दर्जेदार शिक्षण, आरोग्यसेवा आणि आर्थिक संधी उपलब्ध असतील. आधुनिक विकासाला स्वीकारताना आपला सांस्कृतिक वारसा जपणाऱ्या डिजिटल सशक्त समुदायाची आम्ही कल्पना करतो.'
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card className="card-modern glass-card border-2 border-white/20 rounded-3xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center shadow-2xl">
                      <Users className="h-8 w-8" />
                    </div>
                    <span className="text-2xl md:text-3xl font-bold">{t('Panchayat Members', 'पंचायत सदस्य')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {members.map((member, index) => {
                      const gradients = [
                        'from-blue-500 to-cyan-500',
                        'from-purple-500 to-pink-500',
                        'from-orange-500 to-red-500',
                        'from-green-500 to-emerald-500'
                      ];
                      return (
                        <div 
                          key={index} 
                          className="group flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-background to-muted/30 border-2 border-white/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg"
                          data-testid={`member-${index}`}
                        >
                          <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${gradients[index]} text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300`}>
                            <Users className="h-8 w-8" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{t(member.nameEn, member.nameMr)}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{t(member.roleEn, member.roleMr)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements Timeline */}
              <Card className="card-modern glass-card border-2 border-white/20 rounded-3xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 text-white flex items-center justify-center shadow-2xl">
                      <Calendar className="h-8 w-8" />
                    </div>
                    <span className="text-2xl md:text-3xl font-bold">{t('Our Achievements', 'आमची उपलब्धी')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="relative pl-8 pb-6 border-l-2 border-primary/30 last:border-l-0 last:pb-0">
                        <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-orange-500 border-4 border-background shadow-lg"></div>
                        <div className="bg-gradient-to-br from-muted/50 to-background p-6 rounded-2xl border border-white/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg group">
                          <div className="flex items-start justify-between mb-3">
                            <span className="inline-block px-4 py-1 bg-gradient-to-r from-primary to-orange-500 text-white text-sm font-bold rounded-full shadow-md">
                              {achievement.year}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {t(achievement.titleEn, achievement.titleMr)}
                          </h3>
                          <p className="text-muted-foreground">
                            {t(achievement.descEn, achievement.descMr)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="card-modern glass-card border-2 border-white/20 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 text-white flex items-center justify-center shadow-2xl">
                      <MapPin className="h-8 w-8" />
                    </div>
                    <span className="text-2xl md:text-3xl font-bold">{t('Contact Us', 'आमच्याशी संपर्क साधा')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-white/20">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('Address', 'पत्ता')}</h4>
                        <p className="text-sm text-muted-foreground">{t('Kishore Village, Taluka, District', 'किशोर गाव, तालुका, जिल्हा')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-white/20">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('Phone', 'दूरध्वनी')}</h4>
                        <p className="text-sm text-muted-foreground">+91 12345 67890</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-white/20">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{t('Email', 'ईमेल')}</h4>
                        <p className="text-sm text-muted-foreground">info@grampanchayat.gov.in</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
