import { loginUser, createUser } from '../../services/userAPI';
import { login } from '../../state/actions';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ title, type }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginMessage, setLoginMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    //! handle login
    if (type === 'login') {
      handleLogin(e);
    } else if (type === 'signup') {
      handleSignup(e);
    }
  };

  const handleLogin = async (e) => {
    const user = {
      email: e.target.email.value,
      password: e.target.password.value
    };

    if (user.email && user.password) {
      // log user in
      const loggedIn = await loginUser(user);
      if (loggedIn.fetched) {
        //store the token in localstorage
        localStorage.setItem('accessToken', loggedIn.data.token);
        //set state in store
        dispatch(login());
        navigate('/');
      } else {
        //display error message
        setLoginMessage(loggedIn.error.message);
        e.target.reset();
      }
    }
  };

  const handleSignup = async (e) => {
    const user = {
      firstName: e.target.firstname.value,
      lastName: e.target.lastname.value,
      handle: e.target.handle.value,
      bio: e.target.bio.value,
      email: e.target.email.value,
      password: e.target.password.value
    };

    // check all the user properties have a value
    for (let prop of Object.values(user)) {
      if (prop === '') {
        setLoginMessage('All inputs must have a value!');
        return;
      }
    }

    // send request to server to create new user
    const userCreated = await createUser(user);
    if (userCreated.fetched) {
      //store the token in localstorage
      localStorage.setItem('accessToken', userCreated.data.token);
      //set state in store
      dispatch(login());
      navigate('/');
    } else {
      //display error message
      setLoginMessage(userCreated.error.message);
      e.target.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 className="title">{title}</h2>
      {type === 'signup' &&
        <>
          <input type="text" name="firstname" placeholder="first name" required />
          <input type="text" name="lastname" placeholder="last name" required />
          <input type="text" name="handle" placeholder="handle/username" required />
        </>}
      <input type="email" name="email" placeholder="email" required />
      <input type="password" name="password" placeholder="password" required />
      {type === 'signup' &&
        <>
          <textarea name="bio" cols="30" rows="3" placeholder='bio' required />
        </>}

      <input className="submit-btn" type="submit" value={title} />
      {loginMessage && <p className="error-message">{loginMessage}</p>}
    </form>
  );
};

export default AuthForm;