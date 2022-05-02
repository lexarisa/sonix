import './styles/login.scss';
import AuthForm from '../components/non-auth/auth-form';
import React from 'react';

const Signup:React.FC = () => {
  return (
    <div className="auth-wrapper">
      <AuthForm title="Signup" type="signup" />
    </div>
  );
};

export default Signup;