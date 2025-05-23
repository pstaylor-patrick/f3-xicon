import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import type { XiconEntry } from '@/lib/xicon';

interface EntryLayoutProps {
  entry: XiconEntry;
  related: XiconEntry[];
  next?: XiconEntry;
  prev?: XiconEntry;
}

export function EntryLayout({ entry, related, next, prev }: EntryLayoutProps) {
  const { title, text, tags, type, url, imageUrl } = entry;

  // Determine badge color based on type
  const badgeColor = {
    exercise: 'bg-blue-100 text-blue-800',
    term: 'bg-green-100 text-green-800',
    article: 'bg-purple-100 text-purple-800',
  }[type];

  // Format text with basic markdown support
  const formatText = (text: string) => {
    // Replace newlines with <br>
    const withLineBreaks = text.replace(/\n/g, '<br>');

    // Return formatted text
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
            <Badge className={badgeColor}>{type}</Badge>
            {type === 'exercise' &&
              tags
                .filter(tag => tag)
                .map(tag => (
                  <Badge key={tag} variant="outline" className="capitalize">
                    {tag}
                  </Badge>
                ))}
          </div>

          <h1 className="mb-6 text-3xl font-bold">{title}</h1>

          {imageUrl && type === 'article' && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <Image
                src={imageUrl || '/placeholder.svg'}
                alt={title}
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="prose max-w-none">{formatText(text)}</div>

          {url && (
            <div className="mt-6">
              <Link href={url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">Read full article</Button>
              </Link>
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
          <h2 className="mb-4 text-xl font-semibold">Related</h2>
          <div className="space-y-4">
            {related.length > 0 ? (
              related.map(item => (
                <Link key={item.id} href={`/xicon/${item.id}`}>
                  <div className="rounded-lg border p-4 transition-colors hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.type === 'exercise' && item.tags.includes('video') && (
                        <Play className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {item.text.substring(0, 100)}
                    </p>
                    <div className="mt-2">
                      <Badge
                        variant="secondary"
                        className={
                          {
                            exercise: 'bg-blue-100 text-blue-800',
                            term: 'bg-green-100 text-green-800',
                            article: 'bg-purple-100 text-purple-800',
                          }[item.type]
                        }
                      >
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No related items found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
