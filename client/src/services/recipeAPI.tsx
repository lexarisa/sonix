import { FormRecipeInterface } from '../interfaces/FormRecipeInterface';

const rootUrl = 'http://localhost:3001';

const getDashboardRecipes = () => {
  return fetch(`${rootUrl}/dashboard`)
    .then((res) => (res.status > 400 ? Promise.reject(res) : res))
    .then((res) => res.json());
};

const getCategoryRecipes = (category: string) => {
  return fetch(`${rootUrl}/category/${category}`, {
    method: 'GET',
  })
    .then((res) => (res.status >= 400 ? Promise.reject(res) : res))
    .then((res) => res.json());
};

const searchAllRecipes = (searchTerm: string) => {
  return fetch(`${rootUrl}/searchAll/${searchTerm}`, {
    method: 'GET',
  })
    .then((res) => (res.status >= 400 ? Promise.reject(res) : res))
    .then((res) => res.json())
    .catch((error) => {
      console.error('Failed to fetch category recipes: ', error);
    });
};

const getRecipe = (id: string) => {
  return fetch(`${rootUrl}/recipe/${id}`)
    .then((res) => (res.status >= 400 ? Promise.reject(res) : res))
    .then((res) => res.json())
    .catch((error) => {
      console.error('Failed to fetch recipe: ', error);
    });
};

const likeRecipe = (recipeId: string) => {
  const token = localStorage.getItem('accessToken');
  return fetch(`${rootUrl}/recipe/like/${recipeId}`, {
    method: 'PATCH',
    credentials: 'include',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.status === 200) return { liked: true };
      else return { liked: false };
    })
    .catch((error) => {
      console.error('Failed to like recipe: ', error);
      return error;
    });
};

const unlikeRecipe = (recipeId: string) => {
  const token = localStorage.getItem('accessToken');
  return fetch(`${rootUrl}/recipe/unlike/${recipeId}`, {
    method: 'PATCH',
    credentials: 'include',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (res.status === 200) return { unliked: true };
      else return { unliked: false };
    })
    .catch((error) => {
      console.error('Failed to unlike recipe: ', error);
      return error;
    });
};

//! post requests
const createRecipe = (recipe: FormRecipeInterface) => {
  const token = localStorage.getItem('accessToken');
  console.log('recipe', recipe);
  return (
    fetch(`${rootUrl}/recipe/create`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(recipe),
    })
      .then((res) => (res.status > 400 ? Promise.reject(res) : res))
      .then((res) => res.json())
      // .then((res) => {
      //   console.log('RES DATA IN API', res);
      //   return { created: true, data: res }
      //   // if (res.status === 201) return { created: true, data: res };
      //   // else return { created: false, error: res };
      // })
      .catch((error) => {
        console.log('error caught');
        console.error('Failed to create recipe: ', error);
        return error;
      })
  );
};

const getProfileRecipes = (recipeIds: { own: string[]; liked: string[] }) => {
  return fetch(`${rootUrl}/recipe/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipeIds),
  })
    .then((res) => (res.status > 400 ? Promise.reject(res) : res))
    .then((res) => {
      return res.json();
    })
    .catch((error) => console.error('Failed to create recipe: ', error));
};

export {
  getDashboardRecipes,
  getCategoryRecipes,
  getRecipe,
  createRecipe,
  likeRecipe,
  unlikeRecipe,
  getProfileRecipes,
  searchAllRecipes,
};
