import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  buttonText: string;
  adminOnly?: boolean;
}

export default function ServiceCard({ icon: Icon, title, description, path, buttonText, adminOnly = false }: ServiceCardProps) {
  const isComingSoon = path === '#' || buttonText.includes('Coming Soon') || buttonText.includes('लवकरच');
  const isDisabled = isComingSoon || adminOnly;
  
  return (
    <Card className={`flex flex-col h-full bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-3xl overflow-hidden group relative transition-all duration-500 ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary/30 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-2'}`}>
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-chart-3/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-chart-3/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 -z-10"></div>
      
      <CardHeader className="flex flex-col items-center gap-3 space-y-0 pb-3 pt-6 text-center relative z-10">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-lg group-hover:shadow-orange-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          <Icon className="h-10 w-10" />
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1 text-gray-900 group-hover:text-orange-600 transition-colors duration-300">{title}</h3>
          <div className="h-0.5 w-12 mx-auto bg-gradient-to-r from-orange-500 to-orange-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-20 transition-all duration-500"></div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 text-center relative z-10 px-6 pb-4">
        <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors">{description}</p>
      </CardContent>
      
      <CardFooter className="relative z-10 pt-4 pb-6 px-6">
        {isDisabled ? (
          <Button disabled className="w-full bg-gray-400 text-white rounded-xl shadow-md font-semibold border-0 cursor-not-allowed">
            {buttonText}
          </Button>
        ) : (
          <Link href={path} className="w-full" data-testid={`link-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold border-0">
              {buttonText}
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
