import { getXiconById, getRelatedXicons, getNextPrevXicons } from '@/lib/xicon';
import { ExerciseDetail } from '@/components/exercise-detail';
import { TermDetail } from '@/components/term-detail';
import { ArticleDetail } from '@/components/article-detail';
import { RegionDetail } from '@/components/region-detail';
import { notFound } from 'next/navigation';
import type { XiconFilter } from '@/lib/xicon';
import { LatLng } from '@/lib/mapUtils';

interface XiconDetailPageProps {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function XiconDetailPage({ params, searchParams }: XiconDetailPageProps) {
  // Await params to ensure they're available
  const { id } = await Promise.resolve(params);
  const entry = await getXiconById(id);

  if (!entry) {
    notFound();
  }

  // Get related entries based on type
  const related = await getRelatedXicons(entry);

  // Await searchParams to ensure they're available
  const resolvedSearchParams = await Promise.resolve(searchParams);

  // Get next and previous entries
  const filter: XiconFilter = {
    kind:
      typeof resolvedSearchParams.kind === 'string'
        ? (resolvedSearchParams.kind as any)
        : undefined,
    tags:
      typeof resolvedSearchParams.tags === 'string'
        ? resolvedSearchParams.tags.split(',').filter(Boolean)
        : [],
    query: typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '',
    tagsOperator:
      typeof resolvedSearchParams.tagsOperator === 'string'
        ? (resolvedSearchParams.tagsOperator as any)
        : 'OR',
    city: typeof resolvedSearchParams.city === 'string' ? resolvedSearchParams.city : undefined,
    state: typeof resolvedSearchParams.state === 'string' ? resolvedSearchParams.state : undefined,
    latLng: entry.latLng ? (entry.latLng as LatLng) : undefined,
  };

  const { next, prev } = await getNextPrevXicons(entry, filter);

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
