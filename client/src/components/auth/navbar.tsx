import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../state/actions';
import Search from '../../assests/icons/search.svg';
import Create from '../../assests/icons/create.svg';
import Logout from '../../assests/icons/logout.svg';
import Profile from '../../assests/icons/profile.svg';

const Navbar = (): JSX.Element => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <div className="nav-inner-wrapper">
        <Link to="/" className="link">
          <h1 className="logo">sonix</h1>
        </Link>

        <ul className="nav-links">
          <li className="nav-link">
            <Link to="/create" className="link">
              <img className="nav-icon" src={Create} alt="login" />
              Create
            </Link>
          </li>

          <li className="nav-link">
            <Link to="/search" className="link">
              <img className="nav-icon" src={Search} alt="login" />
              Search
            </Link>
          </li>

          <li className="nav-link">
            <Link to="/me" className="link">
              <img className="nav-icon" src={Profile} alt="login" />
              Profile
            </Link>
          </li>

          <li className="nav-link" onClick={handleLogout}>
            <Link to="/" className="link">
              <img className="nav-icon" src={Logout} alt="login" />
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
