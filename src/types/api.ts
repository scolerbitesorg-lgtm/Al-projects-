export type ApiCategory = 
  | 'Fun & Quotes'
  | 'Movies, Music & Books'
  | 'Games & Anime'
  | 'Weather & Location'
  | 'Space & Science'
  | 'Finance & Crypto'
  | 'Food & Health'
  | 'Animals & Nature'
  | 'Developer Tools'
  | 'Education & Language'
  | 'News & Social'
  | 'India Data'
  | 'Avatars & Images';

export interface ApiItem {
  id: string;
  name: string;
  category: ApiCategory;
  categoryIcon: string;
  url: string;
  description: string; // Hinglish usage description
  englishDesc: string;
  method?: 'GET' | 'POST';
  authType: 'No Key' | 'Free Demo Key' | 'Optional Key';
  isPremium?: boolean;
  tags: string[];
  sampleParams?: Record<string, string>;
  componentName: string;
  customPreviewType?: 
    | 'quiz'
    | 'pincode'
    | 'dictionary'
    | 'weather'
    | 'country'
    | 'pokemon'
    | 'fakestore'
    | 'currency'
    | 'qr'
    | 'color'
    | 'joke'
    | 'randomuser'
    | 'robohash'
    | 'iss'
    | 'httpcat'
    | 'numbers'
    | 'factquote'
    | 'universal';
  defaultMockData?: any;
}

export interface ApiResponseResult {
  status: number;
  statusText: string;
  ok: boolean;
  latencyMs: number;
  data: any;
  rawText?: string;
  contentType: string;
  headers: Record<string, string>;
  error?: string;
  usedProxy?: boolean;
}
