import './styles/login.scss';
import AuthForm from '../components/non-auth/auth-form';

const Signup = () => {
  return (
    <div className="auth-wrapper">
      <AuthForm title="Signup" type="signup" />
    </div>
  );
};

export default Signup;