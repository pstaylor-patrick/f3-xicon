'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { XiconEntry } from '@/lib/xicon';
import { RelatedItems } from './related-items';
import { badgeColor } from './xicon-card';

interface ArticleDetailProps {
  entry: XiconEntry;
  related: XiconEntry[];
  next?: XiconEntry;
  prev?: XiconEntry;
}

export function ArticleDetail({ entry, related, next, prev }: ArticleDetailProps) {
  const { title, text, quadrant, articleUrl, featuredImageUrl } = entry;

  // Format text with basic markdown support
  const formatText = (text: string) => {
    // Replace newlines with <br> and paragraphs with <p> tags
    const paragraphs = text.split(/\n\n+/);
    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    );
  };

  // Format quadrant for display
  const formatQuadrant = (quadrant: string) => {
    return quadrant.charAt(0).toUpperCase() + quadrant.slice(1);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/" className="text-gray-500 hover:text-gray-700">
          ← Back to search
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge className={badgeColor.article}>Article</Badge>
            {quadrant && (
              <Badge variant="outline" className="capitalize">
                {formatQuadrant(quadrant)}
              </Badge>
            )}
          </div>

          <h1 className="mb-6 text-3xl font-bold">{title}</h1>

          {featuredImageUrl && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <Image
                src={featuredImageUrl || '/placeholder.svg'}
                alt={title}
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="prose max-w-none">{formatText(text)}</div>

          {articleUrl && (
            <div className="mt-6">
              <Link href={articleUrl} target="_blank" rel="noopener noreferrer">
                <Button className="bg-f3-red hover:bg-f3-red/90 text-white">
                  Read full article
                </Button>
              </Link>
            </div>
          )}

          <div className="mt-8 flex justify-between">
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

        <div>
          <div className="space-y-4">
            {related.length > 0 ? (
              <RelatedItems
                entry={entry}
                items={related.filter(item => item.type === 'article')}
                title="Related Articles"
              />
            ) : (
              <p className="text-gray-500">No related articles found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
