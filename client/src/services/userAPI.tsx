import { UserInterface } from '../interfaces/UserInterface';
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
    .then((res) => (res.status >= 400 ? Promise.reject(res) : res))
    .then((res) => {
      const data = res.json();
      return data;
    })
    .catch((error) => console.error(error));
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
      const data = res.json();
      // return { fetched: true, data };
      // else return { fetched: false, error: data };
      return data;
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
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => (res.status >= 400 ? Promise.reject(res) : res))
    .then((res) => res.json())
    .catch((error) => console.error('Failed to create recipe: ', error));
};

const getUserProfile = (userHandle: string) => {
  return fetch(`${rootUrl}/user/${userHandle}`)
    .then((res) => (res.status >= 400 ? Promise.reject(res) : res))
    .then((res) => res.json())
    .catch((error) => console.error('Failed to create recipe: ', error));
};

const updateMyProfile = (updated: { bio: string }) => {
  //! what are we passing?
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
    });
};

export { createUser, loginUser, getMyProfile, getUserProfile, updateMyProfile };
