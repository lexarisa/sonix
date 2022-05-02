import './styles/login.scss';
import AuthForm from '../components/non-auth/auth-form';
import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="auth-wrapper">
      <AuthForm title="Login" type="login" />
    </div>
  );
};

export default Login;