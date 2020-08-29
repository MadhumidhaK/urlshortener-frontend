import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
} from 'reactstrap';
import {
    NavLink
} from 'react-router-dom';

const NavBar = (props) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggle = () => setIsOpen(!isOpen);
  
    return (
      <div>
        <Navbar className="flex-nowrap" color="dark" dark expand="md">
          <NavbarBrand><NavLink to="/">reactstrap</NavLink></NavbarBrand>
            <Nav className="ml-auto flex-row" navbar>
              <NavItem className="px-2">
                <NavLink to="/login">Components</NavLink>
              </NavItem>
              <NavItem className="px-2">
                <NavLink to="/signup">GitHub</NavLink>
              </NavItem>     
            </Nav>
        </Navbar>
      </div>
    );
}
  
export default NavBar;