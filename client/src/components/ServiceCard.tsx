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
}

export default function ServiceCard({ icon: Icon, title, description, path, buttonText }: ServiceCardProps) {
  return (
    <Card className="flex flex-col h-full card-modern glass-card border-2 border-white/20 hover:border-primary/40 rounded-2xl overflow-hidden group relative">
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-3/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      
      <CardHeader className="flex flex-col items-center gap-4 space-y-0 pb-4 text-center relative z-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-white shadow-xl icon-glow group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">{title}</h3>
          <div className="h-1 w-16 mx-auto bg-gradient-to-r from-primary to-chart-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 text-center relative z-10">
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
      
      <CardFooter className="relative z-10">
        <Link href={path} className="w-full" data-testid={`link-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <Button className="w-full btn-futuristic text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
            {buttonText}
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
