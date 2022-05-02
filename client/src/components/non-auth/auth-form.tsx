import { loginUser, createUser } from '../../services/userAPI';
import { login } from '../../state/actions';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//interfaces
interface Props {
  title: string;
  type: string;
}

const AuthForm: React.FC<Props> = ({ title, type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // handle login
    if (type === 'login') {
      handleLogin(e);
    } else if (type === 'signup') {
      handleSignup(e);
    }
  };
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    const user = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };

    if (user.email && user.password) {
      // log user in
      const loggedIn = await loginUser(user);
      if (loggedIn) {
        //store the token in localstorage
        localStorage.setItem('accessToken', loggedIn.token);
        //set state in store
        dispatch(login());
        navigate('/');
      } else {
        //display error message
        setLoginMessage('loggedIn.error.message');
        e.currentTarget.email.value = '';
      }
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    const user = {
      firstName: e.currentTarget.firstname.value,
      lastName: e.currentTarget.lastname.value,
      handle: e.currentTarget.handle.value,
      bio: e.currentTarget.bio.value,
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };

    // check all the user properties have a value
    for (let prop of Object.values(user)) {
      if (prop === '') {
        setLoginMessage('All inputs must have a value!');
        return;
      }
    }
    // send request to server to create new user
    try {
      const userCreated = await createUser(user);

      //store the token in localstorage
      console.log('UserCreated', userCreated);
      localStorage.setItem('accessToken', userCreated.token);
      //set state in store
      dispatch(login());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 className="title">{title}</h2>
      {type === 'signup' && (
        <>
          <input
            type="text"
            name="firstname"
            placeholder="first name"
            required
          />
          <input type="text" name="lastname" placeholder="last name" required />
          <input
            type="text"
            name="handle"
            placeholder="handle/username"
            required
          />
        </>
      )}
      <input type="email" name="email" placeholder="email" required />
      <input type="password" name="password" placeholder="password" required />
      {type === 'signup' && (
        <>
          <textarea name="bio" cols={30} rows={3} placeholder="bio" required />
        </>
      )}

      <input className="submit-btn" type="submit" value={title} />
      {loginMessage && <p className="error-message">{loginMessage}</p>}
    </form>
  );
};

export default AuthForm;
