export interface AgeInterface {
  years: number,
  months: number,
  days: number,
  description?: string;
}

export interface DateRangeInterface {
  startDate: string | null,
  stopDate: string | null,
}

export type TimeGroupType = 'MORNING' | 'MID-DAY' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
