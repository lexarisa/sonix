import { UserSignInInterface } from '../interfaces/UserSignInInterface';

const rootUrl = 'http://localhost:3001';

//! get requests

//! post requests
const createUser = async (newUser: UserSignInInterface) => {
  //TODO create interface signed up user
  return fetch(`${rootUrl}/register`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
  })
    .then((res) => {
      const data = res.json();
      if (res.status >= 400) {
        return Promise.reject(data); //ERROR
      }
      return data;
    })
    .catch((err) => console.error(err));
};

const loginUser = async (user: { email: string; password: string }) => {
  return fetch(`${rootUrl}/login`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  })
    .then((res) => (res.status >= 400 ? Promise.reject(res) : res))
    .then((res) => {
      console.log('AUTH RES', res);
      return res.json();
    })
    .then((data) => {
      // if (res.status==200) return {authenticated:true,data} ;
      // else return {authenticated:false,data};
      return { authenticated: true, data };
    })
    .catch((error) => {
      // console.error(error);
      return error;
    });
};

const getMyProfile = async () => {
  const token = localStorage.getItem('accessToken');
  return fetch(`${rootUrl}/profile/myProfile`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => (res.status >= 400 ? Promise.reject(res) : res))
    .then((res) => res.json())
    .catch((error) => {
      // console.error('Failed get profile: ', error);
      return error;
    });
};

const getUserProfile = (userHandle: string) => {
  return fetch(`${rootUrl}/user/${userHandle}`)
    .then((res) => (res.status >= 400 ? Promise.reject(res) : res))
    .then((res) => res.json())
    .catch((error) => {
      console.error('Failed to create recipe: ', error);
      return error;
    });
};

const updateMyProfile = (updated: { bio: string }) => {
  const token = localStorage.getItem('accessToken');
  return fetch(`${rootUrl}/profile/edit`, {
    method: 'PATCH',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updated),
  })
    .then((res) => (res.status >= 400 ? Promise.reject(res) : res))
    .then((res) => res.json())
    .catch((error) => {
      console.error('Failed to like recipe: ', error);
      return error;
    });
};

export { createUser, loginUser, getMyProfile, getUserProfile, updateMyProfile };
