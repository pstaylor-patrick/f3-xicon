import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RelatedItems } from '@/components/related-items';
import type { XiconEntry } from '@/lib/xicon';
import { badgeColor } from './xicon-card';

interface EntryLayoutProps {
  entry: XiconEntry;
  related: XiconEntry[];
  next?: XiconEntry;
  prev?: XiconEntry;
}

export function EntryLayout({ entry, related, next, prev }: EntryLayoutProps) {
  const { title, text, tags, type, articleUrl, featuredImageUrl } = entry;

  // Format text with basic markdown support
  const formatText = (text: string) => {
    // Replace newlines with <br>
    const withLineBreaks = text.replace(/\n/g, '<br>');

    // Return formatted text
    return <div dangerouslySetInnerHTML={{ __html: withLineBreaks }} />;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/xicon" className="text-muted-foreground hover:text-foreground">
          ← Back to search
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Badge className={badgeColor[type]}>{type}</Badge>
            {type === 'exercise' &&
              tags
                ?.filter(tag => tag)
                .map(tag => (
                  <Badge key={tag} variant="outline" className="capitalize">
                    {tag}
                  </Badge>
                ))}
          </div>

          <h1 className="mb-8 text-4xl font-bold tracking-tight">{title}</h1>

          {featuredImageUrl && type === 'article' && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <Image
                src={featuredImageUrl || '/placeholder.svg'}
                alt={title}
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert">{formatText(text)}</div>

          {articleUrl && (
            <div className="mt-8">
              <Link href={articleUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">Read full article</Button>
              </Link>
            </div>
          )}

          <div className="mt-12 flex justify-between">
            {prev ? (
              <Link href={`/${prev.id}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link href={`/${next.id}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        <div className="lg:mt-0">
          <RelatedItems
            items={related}
            title={`Related ${type === 'exercise' ? 'Exercises' : type === 'term' ? 'Terms' : type === 'article' ? 'Articles' : 'Regions'}`}
          />
        </div>
      </div>
    </div>
  );
}
