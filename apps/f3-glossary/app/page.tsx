import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-6 text-4xl font-bold">F3 Nation Xicon</h1>
      <p className="mb-8 max-w-md text-gray-600">
        Search exercises, terms, and articles from F3 Nation
      </p>

      <Link href="/xicon">
        <Button
          variant="default"
          className="bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Start Searching
        </Button>
      </Link>
    </div>
  );
}
