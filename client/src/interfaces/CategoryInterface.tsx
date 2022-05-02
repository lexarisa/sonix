export interface CategoryInterface {
  _id: string;
  creatorHandle: string;
  title: string;
  description: string;
  numberOfLikes?: number;
  category: string;
  originalSynth: string;
  preview?: string;
  tags: string[];
}
