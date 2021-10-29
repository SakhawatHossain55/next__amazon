import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  navbar: {
    backgroundColor: "#203040",
    "& a": {
      color: "#ffffff",
      marginLeft: 10,
    },
  },

  footer: {
    backgroundColor: "#203040",
  },

  brand: {
    fontWeight: "bold",
    fontSize: "1.5rem",
  },

  grow: {
    flexGrow: 1,
  },

  main: {
    minHeight: "80vh",
  },

  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  form: {
    width: "100%",
    maxWidth: 800,
    margin: "0 auto",
  },
  navbarButton: {
    color: "#ffffff",
    texTransform: "initial",
  },
  transparentBackground: {
    backgroundColor: "transparent",
  },
  error: {
    color: "#f04040",
  },
  edit: {
    display: "flex",
  },
  fullWidth: {
    width: "100%",
  },
});

export default useStyles;
