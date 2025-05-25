import Link from 'next/link';
import { Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { badgeColor } from '@/components/xicon-card';
import type { XiconEntry } from '@/lib/xicon';

interface RelatedItemsProps {
  items: XiconEntry[];
  title: string;
  className?: string;
}

export function RelatedItems({ items, title, className = '' }: RelatedItemsProps) {
  // Cap recommendations to 3
  const displayedItems = items.slice(0, 3);
  return (
    <div className={className}>
      <h2 className="mb-6 text-xl font-semibold tracking-tight">{title}</h2>
      <div>
        {displayedItems.length > 0 ? (
          displayedItems.map((item, idx) => (
            <Link
              key={item.id}
              href={`/xicon/${item.id}`}
              className={`block ${idx !== displayedItems.length - 1 ? 'mb-6' : ''}`}
            >
              <div className="rounded-xl border bg-background p-4 transition-colors hover:bg-accent">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{item.title}</h3>
                  {item.type === 'exercise' && item.tags?.includes('video') && (
                    <Play className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {item.text.substring(0, 100)}
                </p>
                <div className="mt-3">
                  <Badge variant="secondary" className={badgeColor[item.type]}>
                    {item.type}
                  </Badge>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-muted-foreground">No related items found</p>
        )}
      </div>
    </div>
  );
}
