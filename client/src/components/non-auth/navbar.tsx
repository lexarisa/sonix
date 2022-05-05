import './styles/navbar.scss';
import { Link } from 'react-router-dom';
import Login from '../../assests/icons/login.svg';
import Signup from '../../assests/icons/signup.svg';
import Search from '../../assests/icons/search.svg';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-inner-wrapper">
        <Link to="/" className='link'>
          <h1 className='logo'>sonix</h1>
        </Link>

        <ul className="nav-links">
          <li className='nav-link' >

            <Link to="/login" className='link login-link' >
              <img className="nav-icon" src={Login} alt="login" />
              Login
            </Link>
          </li>

          <li className='nav-link' >
            <Link to="/signup" className='link signup-link' >
              <img className="nav-icon" src={Signup} alt="signup" />
              Signup
            </Link>
          </li>

          <li className='nav-link'>
            <Link to="/search" className='link search-link' >
              <img className="nav-icon" src={Search} alt="search" />
              Search
            </Link>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;