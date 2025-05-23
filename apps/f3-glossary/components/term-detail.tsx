'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/xicon" className="text-gray-500 hover:text-gray-700">
          ← Back to search
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-4">
            <Badge className="bg-green-100 text-green-800">Glossary Term</Badge>
          </div>

          <h1 className="mb-6 text-3xl font-bold">{title}</h1>

          {aliases && aliases.length > 0 && (
            <div className="mb-4 rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-700">Also known as:</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {aliases.map(alias => (
                  <Badge key={alias} variant="outline">
                    {alias}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="prose max-w-none">{formatText(text)}</div>

          <div className="mt-8 flex justify-between">
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

        <div>
          <h2 className="mb-4 text-xl font-semibold">Related Terms</h2>
          <div className="space-y-4">
            {related.length > 0 ? (
              related
                .filter(item => item.type === 'term')
                .map(item => (
                  <Link key={item.id} href={`/xicon/${item.id}`}>
                    <div className="rounded-lg border p-4 transition-colors hover:bg-gray-50">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {item.text.substring(0, 100)}
                      </p>
                    </div>
                  </Link>
                ))
            ) : (
              <p className="text-gray-500">No related terms found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
