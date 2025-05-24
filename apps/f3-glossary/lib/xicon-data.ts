import type { ExiconEntry, LexiconEntry, QSourceArticle, Region } from '@/types';

export const exicon: ExiconEntry[] = [
  {
    title: 'AMERICAN HAMMERS',
    text: 'Start in plank position. Do a pushup, then jump feet towards hands into squat position. Explode upwards with hands overhead.',
    tags: ['strength', 'full body', 'cardio'],
  },
  {
    title: 'BURPEES',
    text: 'A full body exercise that combines a squat, push-up, and jump.',
    tags: ['cardio', 'strength', 'full body'],
  },
  {
    title: 'DERKINS',
    text: 'Like a merkin, but done on a curb.',
    tags: ['strength', 'upper body', 'arms'],
  },
  {
    title: 'DIAMOND MERKINS',
    text: 'Merkins with hands close together, forming a diamond shape under the chest.',
    tags: ['strength', 'upper body', 'arms'],
  },
  {
    title: 'LUNGES',
    text: 'A lower body exercise where you step forward and lower your body.',
    tags: ['strength', 'lower body', 'legs'],
  },
  {
    title: 'MERKINS',
    text: 'A classic upper body exercise, also known as a push-up.',
    tags: ['strength', 'upper body', 'arms'],
  },
  {
    title: 'MOUNTAIN CLIMBERS',
    text: 'An exercise where you alternate bringing your knees to your chest in a plank position.',
    tags: ['cardio', 'core'],
  },
  {
    title: 'SQUATS',
    text: 'A lower body exercise where you bend your knees and lower your hips.',
    tags: ['strength', 'lower body', 'legs'],
  },
  {
    title: 'STAR JUMPS',
    text: 'A full body exercise where you jump and spread your arms and legs out like a star.',
    tags: ['cardio', 'full body'],
  },
  {
    title: 'WALKING LUNGES',
    text: 'Lunges performed while moving forward.',
    tags: ['strength', 'lower body', 'legs'],
  },
];

export const lexicon: LexiconEntry[] = [
  {
    title: 'AO',
    text: 'Area of Operation: The specific location where an F3 workout takes place.',
  },
  {
    title: 'BD',
    text: 'Abbreviation for Beatdown.',
  },
  {
    title: 'COT',
    text: 'Circle of Trust: The closing of every F3 workout.',
  },
  {
    title: 'F3',
    text: 'Fitness, Fellowship and Faith.',
  },
  {
    title: 'FNG',
    text: 'Friendly New Guy: A man on his first F3 workout.',
  },
  {
    title: 'F3 MISSION',
    text: "To Plant, Serve and Grow men's small Workout groups in order to reinvigorate Male Community Leadership.",
  },
  {
    title: 'MUMBLECHAT',
    text: 'The quiet chatter that occurs during exercises, often consisting of complaints and sarcastic remarks.',
  },
  {
    title: 'PAX',
    text: 'The men of F3.',
  },
  {
    title: 'POST',
    text: 'To attend an F3 workout.',
  },
  {
    title: 'PRE-BLAST',
    text: 'An announcement of an upcoming event or workout.',
  },
  {
    title: 'Q',
    text: 'The leader of an F3 workout.',
  },
  {
    title: 'QSOURCE',
    text: "F3's leadership curriculum.",
  },
  {
    title: 'RUCK',
    text: 'To walk or hike with a weighted backpack.',
  },
  {
    title: 'RUCKER',
    text: 'Those PAX who like to engage in Ruckership.',
  },
  {
    title: 'RUNATERIA',
    text: "Mid-stride communal banter of the PAX intended for ponderings, deep moments and satirical quips to best tackle life's unknowable quandaries, mundane problems and latest Rich Roll podcast. Heavy on the 2nd and 3rd F. Neither triple board certification nor outlook calendar invite required for participation. Perfected at the Horse Lot Hustle - F3 Charleston",
  },
  {
    title: 'RWO',
    text: 'Short for Redwood Original.',
  },
  {
    title: 'S2G',
    text: 'Exhortation through the loving application of sarcastic shame-goading.',
  },
  {
    title: 'S2T',
    text: 'Short for Support The Troops.',
  },
  {
    title: 'SAD CLOWN',
    text: 'A man with Decelerating Fitness, Fellowship and/or Faith.',
  },
  {
    title: 'SAD CLOWN SYNDROME',
    text: 'A state of chronic Sad Clown-ism.',
  },
  {
    title: 'SARONG',
    text: "A towel wrapped around one's waist in preparation or recovery from a Workout.",
  },
  {
    title: 'SCHOOLING',
    text: 'The phase of an LDP during which formal Leadership instruction is provided. (Q4.2).',
  },
  {
    title: 'SCRIPTURE',
    text: 'A verse of Wisdom that exemplifies the Statement and demonstrates the timeless nature of the leadership concept that it represents.',
  },
  {
    title: 'SYITG',
    text: 'Short for See You In The Gloom. An F3ish Hasta la vista!',
  },
];

export const qSourceArticles: QSourceArticle[] = [
  {
    title: 'The Importance of Posting',
    fullText:
      "Regular attendance at F3 workouts, known as 'posting,' is crucial for building consistency, accountability, and community. When you post regularly, you not only improve your own fitness but also inspire and encourage others. Your presence matters, even on days when you don't feel like showing up. The community aspect of F3 is built on the foundation of men consistently showing up for each other, rain or shine, creating bonds that extend beyond the workout itself.",
    quadrant: 'foundations',
    articleUrl: 'https://f3nation.com/the-importance-of-posting/',
    featuredImageUrl: '/placeholder.svg?height=400&width=800&query=F3 workout group',
  },
  {
    title: 'The Five Core Principles',
    fullText:
      'F3 is built on five core principles that guide everything we do: 1) Free of Charge - F3 workouts are always free, removing financial barriers to fitness. 2) Open to All Men - Any man, regardless of fitness level, is welcome. 3) Held Outdoors - We embrace the elements, rain or shine. 4) Peer-Led - Each workout is led by men who are not professional trainers. 5) Ends with a Circle of Trust (COT) - Every workout concludes with a brief gathering where announcements are made and participants share thoughts.',
    quadrant: 'foundations',
    articleUrl: 'https://f3nation.com/the-five-core-principles/',
    featuredImageUrl: '/placeholder.svg?height=400&width=800&query=F3 men in circle outdoors',
  },
  {
    title: 'Leadership in F3',
    fullText:
      'Leadership in F3 is about service, not status. We believe that every man has leadership potential that can be developed through the three Fs: Fitness, Fellowship, and Faith. By taking turns leading workouts (the Q), men practice public speaking, planning, and execution in a supportive environment. This leadership extends beyond the workout into our families, workplaces, and communities. F3 creates better leaders by providing opportunities to lead, fail, learn, and grow.',
    quadrant: 'lead right (q3)',
    articleUrl: 'https://f3nation.com/leadership/',
    featuredImageUrl: '/placeholder.svg?height=400&width=800&query=F3 workout leader',
  },
];
