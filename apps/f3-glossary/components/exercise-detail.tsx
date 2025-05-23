'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/xicon" className="text-gray-500 hover:text-gray-700">
          ← Back to search
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">Exercise</Badge>
            {tags &&
              tags.filter(Boolean).map(tag => (
                <Badge key={tag} variant="outline" className="capitalize">
                  {tag}
                </Badge>
              ))}
          </div>

          <h1 className="mb-6 text-3xl font-bold">{title}</h1>

          <div className="prose max-w-none">{formatText(text)}</div>

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
          <h2 className="mb-4 text-xl font-semibold">Related Exercises</h2>
          <div className="space-y-4">
            {related.length > 0 ? (
              related
                .filter(item => item.type === 'exercise')
                .map(item => (
                  <Link key={item.id} href={`/xicon/${item.id}`}>
                    <div className="rounded-lg border p-4 transition-colors hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{item.title}</h3>
                        {item.youtubeId && <Play className="h-4 w-4 text-gray-400" />}
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                        {item.text.substring(0, 100)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.tags &&
                          item.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs capitalize">
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </Link>
                ))
            ) : (
              <p className="text-gray-500">No related exercises found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
