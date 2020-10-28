export interface Entry {
  id: number;
  creatorId: number;
  categoryId: number;
  question: string;
  hint: string;
  answer: string;
  result?: number;
}
