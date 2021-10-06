import React from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  AppBar,
  Container,
  Link,
  Toolbar,
  Typography,
} from "@material-ui/core";
import useStyles from "../utils/styles";

export default function Layout({ children, title, description }) {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>{title ? `${title} - Next Amazon` : "Next Amazon"}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <AppBar position="static" className={classes.navbar}>
        <Toolbar>
          <NextLink href="/" passHref>
            <Link>
              <Typography className={classes.brand}>amazon</Typography>
            </Link>
          </NextLink>
          <div className={classes.grow}></div>
          <div>
            <NextLink href="/cart" passHref>
              <Link>Cart</Link>
            </NextLink>
            <NextLink href="/login" passHref>
              <Link>Login</Link>
            </NextLink>
          </div>
        </Toolbar>
      </AppBar>
      <Container className={classes.main}>{children}</Container>
      <footer className={classes.footer}>
        All rights reserved. Next Amazon
      </footer>
    </div>
  );
}
