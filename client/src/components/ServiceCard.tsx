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
    <Card className="flex flex-col h-full border-l-4 border-l-primary">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter>
        <Link href={path} className="w-full" data-testid={`link-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <Button className="w-full">{buttonText}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
