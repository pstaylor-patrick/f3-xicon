'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RelatedItems } from '@/components/related-items';
import type { XiconEntry } from '@/lib/xicon';

interface ExerciseDetailProps {
  entry: XiconEntry;
  related: XiconEntry[];
  next?: XiconEntry;
  prev?: XiconEntry;
}

export function ExerciseDetail({ entry, related, next, prev }: ExerciseDetailProps) {
  const { title, text, tags, youtubeId } = entry;

  // Format text with basic markdown support
  const formatText = (text: string) => {
    // Replace newlines with <br>
    const withLineBreaks = text.replace(/\n/g, '<br>');
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
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              Exercise
            </Badge>
            {tags &&
              tags.filter(Boolean).map(tag => (
                <Badge key={tag} variant="outline" className="capitalize">
                  {tag}
                </Badge>
              ))}
          </div>

          <h1 className="mb-8 text-4xl font-bold tracking-tight">{title}</h1>

          <div className="prose prose-lg max-w-none dark:prose-invert">{formatText(text)}</div>

          {youtubeId && (
            <div className="mt-8 aspect-video w-full overflow-hidden rounded-lg">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={`${title} demonstration`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              ></iframe>
            </div>
          )}

          <div className="mt-12 flex justify-between">
            {prev ? (
              <Link href={`/xicon/${prev.id}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link href={`/xicon/${next.id}`}>
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
            items={related.filter(item => item.type === 'exercise')}
            title="Related Exercises"
          />
        </div>
      </div>
    </div>
  );
}
