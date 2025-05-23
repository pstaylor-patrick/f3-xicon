import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, MapPin } from 'lucide-react';
import type { XiconEntry } from '@/lib/xicon';

export const badgeColor = {
  exercise: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  term: 'bg-green-100 text-green-800 hover:bg-green-200',
  article: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  region: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
};

interface XiconCardProps {
  entry: XiconEntry;
}

export function XiconCard({ entry }: XiconCardProps) {
  const { id, title, text, tags, type, city, state } = entry;

  return (
    <Link href={`/xicon/${id}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-medium line-clamp-1">{title}</h3>
            {type === 'exercise' && tags?.includes('video') && (
              <Play className="h-4 w-4 text-gray-400" />
            )}
            {type === 'region' && <MapPin className="h-4 w-4 text-f3-red" />}
          </div>

          <div className="mt-2">
            {type === 'region' ? (
              <p className="text-sm text-gray-600">
                {city ? city + ', ' : ''}
                {state}
              </p>
            ) : (
              <p className="text-sm text-gray-600 line-clamp-3">{text.substring(0, 120)}</p>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className={badgeColor[type]}>
              {type}
            </Badge>

            {type === 'exercise' &&
              tags &&
              tags
                .filter(tag => tag)
                .slice(0, 3)
                .map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs capitalize">
                    {tag}
                  </Badge>
                ))}

            {type === 'article' && entry.quadrant && (
              <Badge variant="outline" className="text-xs">
                {entry.quadrant}
              </Badge>
            )}

            {type === 'region' && state && (
              <Badge variant="outline" className="text-xs">
                {state}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
