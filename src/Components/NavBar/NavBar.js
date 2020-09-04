import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Button,
} from 'reactstrap';
import {
    NavLink
} from 'react-router-dom';

import "./NavBar.css"
import { useRecoilValue, useRecoilState, useResetRecoilState } from 'recoil';
import { authenticationStateRecoil } from '../../sharedStates/authenticationState';
import { urlFormStateRecoil } from '../../sharedStates/urlFormState';

const NavBar = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [authenticationState, setAuthenticationState] = useRecoilState(authenticationStateRecoil);
    const [urlFormState, setUrlFormState] = useRecoilState(urlFormStateRecoil);
    const resetForm = useResetRecoilState(urlFormStateRecoil);

    const logoutHandler = () => {
      window.localStorage.removeItem('auth-token');
      setAuthenticationState({
          isAuthenticated: false,
          token: undefined
      });
    }
  
    return (
      <div>
        <Navbar className="flex-nowrap" color="dark" dark expand="md">
          <NavbarBrand><NavLink to="/">MinyURL</NavLink></NavbarBrand>
            <Nav className="ml-auto flex-row align-items-center" navbar>
              {
                authenticationState.isAuthenticated ? 
                (
                  <>
                    <NavItem className="px-2">
                        <a role="button" className="text-light m-0" onClick={() => {
                              resetForm();
                              setUrlFormState({
                                isOpen: true,
                                createURL: true
                            })
                        }} color="warning" size="sm">Create
                        </a>
                    </NavItem>
                    <NavItem className="px-2">
                     <a role="button" className="text-danger m-0" onClick={logoutHandler}>Log out</a>
                    </NavItem>
                  </>
                )
                  : 
                  (
                    <>
                       <NavItem className="px-2">
                        <NavLink to="/login">Login</NavLink>
                      </NavItem>
                      <NavItem className="px-2">
                        <NavLink to="/signup">Sign Up</NavLink>
                      </NavItem>  
                    </>
                  )
              } 
            </Nav>
        </Navbar>
      </div>
    );
}
  
export default NavBar;