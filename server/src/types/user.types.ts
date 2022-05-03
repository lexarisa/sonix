import { Request, Response, NextFunction } from 'express';

export type UserTypes = {
  _id?: string;
  firstName: string;
  lastName: string;
  handle: string;
  bio: string;
  email: string;
  password: string;
  ownRecipes: string[];
  likedRecipes: string[];
};

export type RecipeType = {
  creatorHandle: string;
  creatorId: string;
  title: string;
  description: string;
  numberOfLikes: number;
  likedBy: string[];
  category: string;
  originalSynth: string;
  preview: string;
  tags: string[];
  ingredients: string[];
  recipeMethod: string[];
};

export type CategoryType = {
  categories: string[];
};

export type CustomRequest = Request & {
  user: UserTypes;
};

export type RecipeResultsType = {
  Popular: RecipeType[];
  [key: string]: RecipeType[];
};

export type LikedObjectType = {
  [key: string]: boolean;
};
