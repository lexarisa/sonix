export interface FormConstructorRecipeInterface {
  title: string;
  description: string;
  category: string;
  originalSynth: string;
  sampleFile: FileList | string;
  tags: { value: string }[];
  ingredients: { value: string }[];
  steps: { step: string }[];
}

export interface FormRecipeInterface {
  title: string;
  description: string;
  category: string;
  originalSynth: string;
  preview: string;
  tags: string[];
  ingredients: string[];
  recipeMethod: string[];
}
