import React, { useContext, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  AppBar,
  Container,
  createTheme,
  Link,
  Toolbar,
  Typography,
  ThemeProvider,
  CssBaseline,
  Switch,
  Badge,
  Button,
  Menu,
  MenuItem,
} from "@material-ui/core";
import useStyles from "../utils/styles";
import Cookies from "js-cookie";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";

export default function Layout({ children, title, description }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWidth: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "1.6rem",
        fontWidth: 400,
        margin: "1rem",
      },
    },
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: "#f0c000",
      },
      secondary: {
        main: "#208080",
      },
    },
  });
  const classes = useStyles();

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? "DARK_MODE_OFF" : "DARK_MODE_ON" });
    const newDarkMode = !darkMode;
    Cookies.set("darkMode", newDarkMode ? "ON" : "OFF");
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    router.push("/");
  };

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next Amazon` : "Next Amazon"}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={classes.navbar}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>
                <Typography className={classes.brand}>Amazon</Typography>
              </Link>
            </NextLink>
            <div className={classes.grow}></div>
            <div>
              <Switch
                checked={darkMode}
                onChange={darkModeChangeHandler}
              ></Switch>
              <NextLink href="/cart" passHref>
                <Link>
                  <Typography component="span">
                    {cart.cartItems.length > 0 ? (
                      <Badge
                        color="secondary"
                        badgeContent={cart.cartItems.length}
                      >
                        Cart
                      </Badge>
                    ) : (
                      "Cart"
                    )}
                  </Typography>
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, "/profile")}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, "/order-history")
                      }
                    >
                      Order History
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, "/admin/dashboard")
                        }
                      >
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>
        <Container className={classes.main}>{children}</Container>
        <footer className="relative">
          <div className="bg-gray-800">
            <div className="md:border-b p-2 border-gray-800 py-20">
              <div className="container">
                <div className="flex md:flex-row justify-between flex-col">
                  <div className="text-white text-lg font-normal md:text-2xl sm:text-xl md:w-1/2 sm:w-auto w-auto px-2">
                    <h3>
                      Want Us To Email You About Special Offers And Updates?
                    </h3>
                  </div>
                  <div className="w-auto md:w-1/2">
                    <div className="flex flex-col items-end w-full px-8 mx-auto space-y-4 lg:w-2/3 sm:flex-row sm:space-x-4 sm:space-y-0 sm:px-0">
                      <div className="relative flex-grow w-full">
                        <input
                          type="email"
                          placeholder="Email address"
                          id="email"
                          name="email"
                          className="w-full px-3 py-1 text-base leading-8 transition-colors duration-200 ease-in-out bg-gray-100 bg-opacity-50 border shadow outline-none focus:border-royal-blue focus:bg-transparent focus:ring-2 focus:royal-blue focus:bg-white"
                        />
                      </div>
                      <Button variant="contained" color="secondary">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              <div className="container">
                <div className="flex justify-around mt-8 mb-10 md:flex-row flex-col">
                  <div className="">
                    <div className="text-2xl text-white border-b py-2 font-medium tracking-wide border-gray-700">
                      <h4>Site Map</h4>
                    </div>
                    <div className="mt-2">
                      <ul className="">
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Documentation
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Feedback
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Plugins
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Support Forums
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Themes
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="">
                    <div className="text-2xl text-white border-b py-2 font-medium tracking-wide border-gray-700">
                      <h4>Useful Links</h4>
                    </div>
                    <div className="mt-2">
                      <ul className="">
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            About Us
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Help Link
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Terms & Conditions
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Contact Us
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Privacy Policy
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="">
                    <div className="text-2xl text-white border-b py-2 font-medium tracking-wide border-gray-700">
                      <h4>Social Contact</h4>
                    </div>
                    <div className="mt-2">
                      <ul className="">
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Facebook
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Twitter
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Instagram
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            YouTube
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Github
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="">
                    <div className="text-2xl text-white border-b py-2 font-medium tracking-wide border-gray-700">
                      <h4>Our Support</h4>
                    </div>
                    <div className="mt-2">
                      <ul className="">
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Help Center
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Paid with Mollie
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Status
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Changelog
                          </a>
                        </li>
                        <li className="py-1 text-lg font-normal">
                          <a className="text-white" href="#">
                            Contact Support
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-12">
              <div className="container">
                <div className="flex justify-center text-white">
                  <p>&copy; 2021 All rights reserved. Next Amazon</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </ThemeProvider>
    </div>
  );
}
