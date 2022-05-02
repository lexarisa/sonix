import './styles/login.scss';
import AuthForm from '../components/non-auth/auth-form';

const Login = () => {
  return (
    <div className="auth-wrapper">
      <AuthForm title="Login" type="login" />
    </div>
  );
};

export default Login;