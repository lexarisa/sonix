const rootUrl = 'http://localhost:3001';

//! get requests
const getDashboardRecipes = () => {
  return fetch(`${rootUrl}/dashboard`, {
    method: 'GET'
  })
    .then(async (res) => {
      const data = await res.json();
      if (res.status === 200) return { fetched: true, data };
      else return { fetched: false, error: data };
    }).catch(error => {
      console.error('Failed to fetch dashboard recipes: ', error);
    });
};

const getCategoryRecipes = async (category) => {
  return fetch(`${rootUrl}/category/${category}`, {
    method: 'GET'
  })
    .then(async (res) => {
      const data = await res.json();
      if (res.status === 200) return { fetched: true, data };
      else return { fetched: false, error: data };
    }).catch(error => {
      console.error('Failed to fetch category recipes: ', error);
    });
};

const searchAllRecipes = (searchTerm) => {
  return fetch(`${rootUrl}/searchAll/${searchTerm}`, {
    method: 'GET'
  })
    .then(async (res) => {
      const data = await res.json();
      if (res.status === 200) return { fetched: true, data };
      else return { fetched: false, error: data };
    }).catch(error => {
      console.error('Failed to fetch category recipes: ', error);
    });
};

const getRecipe = (id) => {
  return fetch(`${rootUrl}/recipe/${id}`, {
    method: 'GET'
  })
    .then(async (res) => {
      const data = await res.json();
      if (res.status === 200) return { fetched: true, data };
      else return { fetched: false, error: data };
    }).catch(error => {
      console.error('Failed to fetch recipe: ', error);
    });
};

const likeRecipe = (recipeId) => {
  const token = localStorage.getItem('accessToken');
  return fetch(`${rootUrl}/recipe/like/${recipeId}`, {
    method: 'PATCH',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (res.status === 200) return { liked: true, };
      else return { liked: false };
    }).catch(error => {
      console.error('Failed to like recipe: ', error);
    });
};

const unlikeRecipe = (recipeId) => {
  const token = localStorage.getItem('accessToken');
  return fetch(`${rootUrl}/recipe/unlike/${recipeId}`, {
    method: 'PATCH',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      if (res.status === 200) return { unliked: true, };
      else return { unliked: false };
    }).catch(error => {
      console.error('Failed to unlike recipe: ', error);
    });
};

//! post requests
const createRecipe = (recipe) => {
  const token = localStorage.getItem('accessToken');
  return fetch(`${rootUrl}/recipe/create`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(recipe),
  }).then(async res => {
    const data = await res.json();
    if (res.status === 201) return { created: true, data };
    else return { created: false, error: data };
  }).catch(error => console.error('Failed to create recipe: ', error));
};

const getProfileRecipes = (recipeIds) => {
  return fetch(`${rootUrl}/recipe/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipeIds),
  }).then(async res => {
    const data = await res.json();
    if (res.status === 200) return { fetched: true, data };
    else return { fetched: false, error: data };
  }).catch(error => console.error('Failed to create recipe: ', error));
};



export {
  getDashboardRecipes,
  getCategoryRecipes,
  getRecipe,
  createRecipe,
  likeRecipe,
  unlikeRecipe,
  getProfileRecipes,
  searchAllRecipes
};