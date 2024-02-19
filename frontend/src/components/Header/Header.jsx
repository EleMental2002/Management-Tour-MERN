import React, { useRef, useEffect, useContext, useState } from "react";
import { Container, Row, Button } from "reactstrap";
import { NavLink, Link, useNavigate } from "react-router-dom";

import logo from "../../assets/images/sikkim hotels.png";
import "./header.css";
import { AuthContext } from "./../../context/AuthContext";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';



const nav__links = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/tours",
    display: "Tours",
  },
  {
    path: "/adventure",
    display: "Adventure",
  },
];





const Header = () => {


  const [showdropdown, setShowDropdown] = useState(false)

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);




  const handleClick = (e) => {
    setShowDropdown(true);
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setShowDropdown(false);
    setAnchorEl(null);
  };


  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const logout = () => {
    handleClose(); // Close the dropdown
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const Booking = () => {
    setShowDropdown(false);
    navigate("/Bookings");
  };

  const stickyHeaderFunc = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    });
  };




  useEffect(() => {
    stickyHeaderFunc()

    return window.removeEventListener('scroll', stickyHeaderFunc)
})




  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");
  return (
    <>
      <header className="header" ref={headerRef}>
        <Container>
          <Row>
            <div className="nav__wrapper d-flex align-items-center justify-content-between">
              {/* ----------logo----------  */}
              <div className="logo">
                <a href="/home">
                  <img src={logo} alt="" />
                </a>
              </div>
              {/* ----------logo end----------  */}
              {/* ----------menu start----------  */}
              <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                <ul className="menu d-flex align-items-center gap-5">
                  {nav__links.map((item, index) => (
                    <li className="nav__item" key={index}>
                      <NavLink
                        to={item.path}
                        className={(navClass) =>
                          navClass.isActive ? "active__link" : ""
                        }
                      >
                        {item.display}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
              {/* ----------menu end----------  */}
              <div className="nav__right d-flex align-items-center gap-4">
                <div className="nav__btns d-flex align-items-center gap-4">
                  {user? (
                    <>
                      {/* <h5 className="mb-0">{user.username}</h5>
                      <Button className="btn btn-dark" onClick={logout}>
                        Logout
                      </Button> */}

                      <div className="av" >
                        <Avatar style={{ background: "#030104", fontWeight: "bold", fontSize: "15px", textTransform: "captilize" }} onClick={handleClick} >{user.username ? (user.username[0]) : (user.hotelname[0])}</Avatar>
                      </div>

                      {showdropdown ? <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}


                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}

                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                      >
                        <MenuItem onClick={handleClose}>{user.email}</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Wishlist</MenuItem>
                        <MenuItem onClick={Booking}>Bookings</MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                      </Menu> : null}
                    </>

                  ) : (
                    <>
                      <Button className="btn secondary__btn">
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button className="btn primary__btn">
                        <Link to="/register">Register</Link>
                      </Button>
                    </>
                  )}
                </div>
                <span className="mobile__menu" onClick={toggleMenu}>
                  <i className="ri-menu-line"></i>
                </span>
              </div>
            </div>
          </Row>
        </Container>
      </header >
    </>
  );
};

export default Header;

// import React, { useRef, useEffect, useContext, useState } from "react";
// import { Container, Row, Button } from "reactstrap";
// import { NavLink, Link, useNavigate } from "react-router-dom";

// import logo from "../../assets/images/sikkim hotels.png";
// import "./header.css";
// import { AuthContext } from "./../../context/AuthContext";
// import Avatar from '@mui/material/Avatar';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';

// const nav__links = [
//   {
//     path: "/home",
//     display: "Home",
//   },
//   {
//     path: "/about",
//     display: "About",
//   },
//   {
//     path: "/tours",
//     display: "Tours",
//   },
//   {
//     path: "/adventure",
//     display: "Adventure",
//   },
// ];

// const Header = () => {
//   const [showdropdown, setShowDropdown] = useState(false)
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (e) => {
//     setShowDropdown(true);
//     setAnchorEl(e.currentTarget);
//   };

//   const handleClose = () => {
//     setShowDropdown(false);
//     setAnchorEl(null);
//   };

//   const headerRef = useRef(null);
//   const menuRef = useRef(null);
//   const navigate = useNavigate();
//   const { user, dispatch } = useContext(AuthContext);

//   const logout = () => {
//     handleClose(); // Close the dropdown
//     dispatch({ type: "LOGOUT" });
//     navigate("/");
//   };

//   const stickyHeaderFunc = () => {
//     window.addEventListener("scroll", () => {
//       if (
//         document.body.scrollTop > 80 ||
//         document.documentElement.scrollTop > 80
//       ) {
//         headerRef.current.classList.add("sticky__header");
//       } else {
//         headerRef.current.classList.remove("sticky__header");
//       }
//     });
//   };

//   useEffect(() => {
//     stickyHeaderFunc();

//     return () => {
//       window.removeEventListener("scroll", stickyHeaderFunc);
//     };
//   }, []);

//   const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

//   return (
//     <>
//       <header className="header" ref={headerRef}>
//         <Container>
//           <Row>
//             <div className="nav__wrapper d-flex align-items-center justify-content-between">
//               <div className="logo">
//                 <a href="/home">
//                   <img src={logo} alt="" />
//                 </a>
//               </div>
//               <div className="navigation" ref={menuRef} onClick={toggleMenu}>
//                 <ul className="menu d-flex align-items-center gap-5">
//                   {nav__links.map((item, index) => (
//                     <li className="nav__item" key={index}>
//                       <NavLink
//                         to={item.path}
//                         className={(navClass) =>
//                           navClass.isActive ? "active__link" : ""
//                         }
//                       >
//                         {item.display}
//                       </NavLink>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="nav__right d-flex align-items-center gap-4">
//                 <div className="nav__btns d-flex align-items-center gap-4">
//                   {user ? (
//                     <>
//                       <div className="av" onClick={handleClick}>
//                         <Avatar style={{ background: "#6da58d", fontWeight: "bold", fontSize: "15px", textTransform: "capitalize" }}>
//                           {user.username ? user.username[0] : ""}
//                         </Avatar>
//                       </div>
//                       {showdropdown && (
//                         <Menu
//                           id="basic-menu"
//                           anchorEl={anchorEl}
//                           open={open}
//                           onClose={handleClose}
//                           MenuListProps={{
//                             'aria-labelledby': 'basic-button',
//                           }}
//                           transformOrigin={{
//                             vertical: 'top',
//                             horizontal: 'right',
//                           }}
//                         >
//                           <MenuItem onClick={handleClose}>Profile</MenuItem>
//                           <MenuItem onClick={handleClose}>My account</MenuItem>
//                           <MenuItem onClick={handleClose}>Wishlist</MenuItem>
//                           <MenuItem onClick={handleClose}>Bookings</MenuItem>
//                           <MenuItem onClick={logout}>Logout</MenuItem>
//                         </Menu>
//                       )}
//                     </>
//                   ) : (
//                     <>
//                       <Button className="btn secondary__btn">
//                         <Link to="/login">Login</Link>
//                       </Button>
//                       <Button className="btn primary__btn">
//                         <Link to="/register">Register</Link>
//                       </Button>
//                     </>
//                   )}
//                 </div>
//                 <span className="mobile__menu" onClick={toggleMenu}>
//                   <i className="ri-menu-line"></i>
//                 </span>
//               </div>
//             </div>
//           </Row>
//         </Container>
//       </header>
//     </>
//   );
// };

// export default Header;