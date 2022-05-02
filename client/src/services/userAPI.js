const rootUrl = 'http://localhost:3001';

//! get requests

//! post requests
const createUser = async (newUser) => {
  return fetch(`${rootUrl}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
  })
    .then(async (res) => {
      const data = await res.json();
      if (res.status === 201) return { fetched: true, data };
      else return { fetched: false, error: data };
    })
    .catch((error) => console.error(error));
};

const loginUser = async (user) => {
  return fetch(`${rootUrl}/login`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then(async (res) => {
      const data = await res.json();
      if (res.status === 200) return { fetched: true, data };
      else return { fetched: false, error: data };
    })
    .catch((error) => console.error(error));
};

const getMyProfile = async () => {
  const token = localStorage.getItem('accessToken');
  return fetch(`${rootUrl}/profile/myProfile`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }).then(async res => {
    const data = await res.json();
    if (res.status === 200) return { fetched: true, data };
    else return { fetched: false, error: data };
  }).catch(error => console.error('Failed to create recipe: ', error));
};

const getUserProfile = async (userHandle) => {
  return fetch(`${rootUrl}/user/${userHandle}`, {
    method: 'GET'
  }).then(async res => {
    const data = await res.json();
    if (res.status === 200) return { fetched: true, data };
    else return { fetched: false, error: data };
  }).catch(error => console.error('Failed to create recipe: ', error));
};

const updateMyProfile = (updated) => {
  const token = localStorage.getItem('accessToken');
  return fetch(`${rootUrl}/profile/edit`, {
    method: 'PATCH',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updated)
  })
    .then(async (res) => {
      if (res.status === 200) return { updated: true, };
      else return { updated: false };
    }).catch(error => {
      console.error('Failed to like recipe: ', error);
    });
};


export { createUser, loginUser, getMyProfile, getUserProfile, updateMyProfile };