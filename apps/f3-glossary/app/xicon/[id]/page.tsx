import { getXiconById, getRelatedXicons, getNextPrevXicons } from '@/lib/xicon';
import { ExerciseDetail } from '@/components/exercise-detail';
import { TermDetail } from '@/components/term-detail';
import { ArticleDetail } from '@/components/article-detail';
import { RegionDetail } from '@/components/region-detail';
import { notFound } from 'next/navigation';
import type { XiconFilter } from '@/lib/xicon';

interface XiconDetailPageProps {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default function XiconDetailPage({ params, searchParams }: XiconDetailPageProps) {
  const { id } = params;
  const entry = getXiconById(id);

  if (!entry) {
    notFound();
  }

  // Get related entries based on type
  const related = getRelatedXicons(entry);

  // Get next and previous entries
  const filter: XiconFilter = {
    kind: typeof searchParams.kind === 'string' ? (searchParams.kind as any) : undefined,
    tags: typeof searchParams.tags === 'string' ? searchParams.tags.split(',').filter(Boolean) : [],
    query: typeof searchParams.q === 'string' ? searchParams.q : '',
    tagsOperator:
      typeof searchParams.tagsOperator === 'string' ? (searchParams.tagsOperator as any) : 'OR',
    city: typeof searchParams.city === 'string' ? searchParams.city : undefined,
    state: typeof searchParams.state === 'string' ? searchParams.state : undefined,
  };

  const { next, prev } = getNextPrevXicons(id, filter);

  // Render the appropriate detail component based on entry type
  switch (entry.type) {
    case 'exercise':
      return <ExerciseDetail entry={entry} related={related} next={next} prev={prev} />;
    case 'term':
      return <TermDetail entry={entry} related={related} next={next} prev={prev} />;
    case 'article':
      return <ArticleDetail entry={entry} related={related} next={next} prev={prev} />;
    case 'region':
      return <RegionDetail entry={entry} related={related} next={next} prev={prev} />;
    default:
      return notFound();
  }
}
