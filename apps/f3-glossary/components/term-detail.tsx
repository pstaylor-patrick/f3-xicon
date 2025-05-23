'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RelatedItems } from '@/components/related-items';
import type { XiconEntry } from '@/lib/xicon';

interface TermDetailProps {
  entry: XiconEntry;
  related: XiconEntry[];
  next?: XiconEntry;
  prev?: XiconEntry;
}

export function TermDetail({ entry, related, next, prev }: TermDetailProps) {
  const { title, text, aliases } = entry;

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
          <div className="mb-6">
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Glossary Term</Badge>
          </div>

          <h1 className="mb-8 text-4xl font-bold tracking-tight">{title}</h1>

          {aliases && aliases.length > 0 && (
            <div className="mb-6 rounded-lg bg-muted p-4">
              <h3 className="text-sm font-medium text-muted-foreground">Also known as:</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {aliases.map(alias => (
                  <Badge key={alias} variant="outline">
                    {alias}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert">{formatText(text)}</div>

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
            items={related.filter(item => item.type === 'term')}
            title="Related Terms"
          />
        </div>
      </div>
    </div>
  );
}
