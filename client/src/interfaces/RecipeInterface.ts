export interface RecipeInterface {
  _id: string;
  creatorHandle: string;
  creatorId: string;
  title: string;
  description: string;
  numberOfLikes: number;
  likedBy: any[];
  category: string;
  originalSynth: string;
  preview: string;
  tags: string[];
  ingredients: string[];
  recipeMethod: string[];
  fetched?: boolean;
}
// TODO checked liked by
