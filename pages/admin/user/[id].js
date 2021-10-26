/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useEffect, useContext, useReducer, useState } from "react";
import {
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TextField,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { getError } from "../../../utils/error";
import { Store } from "../../../utils/Store";
import Layout from "../../../components/Layout";
import useStyles from "../../../utils/styles";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import axios from "axios";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}

function UserEdit({ params }) {
  const userId = params.id;
  const { state } = useContext(Store);
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const [isAdmin, setIsAdmin] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const classes = useStyles();
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    } else {
      const fetchData = async () => {
        try {
          dispatch({ type: "FETCH_REQUEST" });
          const { data } = await axios.get(`/api/admin/users/${userId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setIsAdmin(data.isAdmin);
          dispatch({ type: "FETCH_SUCCESS" });
          setValue("name", data.name);
        } catch (err) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);

  const submitHandler = async ({ name }) => {
    closeSnackbar();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/admin/users/${userId}`,
        {
          name,
          isAdmin,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      enqueueSnackbar("User updated successfully", { variant: "success" });
      router.push("/admin/users");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  return (
    <Layout title={`Edit User ${userId}`}>
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Typography component="h1" variant="h1">
                  Edit User {userId}
                </Typography>
              </ListItem>
              <ListItem>
                {loading && <CircularProgress></CircularProgress>}
                {error && (
                  <Typography className={classes.error}>{error}</Typography>
                )}
              </ListItem>
              <ListItem>
                <form
                  onSubmit={handleSubmit(submitHandler)}
                  className={classes.form}
                >
                  <List>
                    <ListItem>
                      <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{
                          required: true,
                        }}
                        render={({ field }) => (
                          <TextField
                            variant="outlined"
                            fullWidth
                            id="name"
                            label="Name"
                            error={Boolean(errors.name)}
                            helperText={errors.name ? "Name is required" : ""}
                            {...field}
                          ></TextField>
                        )}
                      ></Controller>
                    </ListItem>
                    <ListItem>
                      <FormControlLabel
                        label="Is Admin"
                        control={
                          <Checkbox
                            onClick={(e) => setIsAdmin(e.target.checked)}
                            checked={isAdmin}
                            name="isAdmin"
                          />
                        }
                      ></FormControlLabel>
                    </ListItem>
                    <ListItem>
                      <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        color="primary"
                      >
                        Update
                      </Button>
                      {loadingUpdate && <CircularProgress />}
                    </ListItem>
                  </List>
                </form>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });

// /* eslint-disable no-unused-vars */
// /* eslint-disable no-undef */

// import axios from "axios";
// import dynamic from "next/dynamic";
// import { useRouter } from "next/router";
// import NextLink from "next/link";
// import React, { useEffect, useContext, useReducer } from "react";
// import {
//   Grid,
//   List,
//   ListItem,
//   Typography,
//   Card,
//   Button,
//   ListItemText,
//   TextField,
//   CircularProgress,
// } from "@material-ui/core";
// import { getError } from "../../../utils/error";
// import { Store } from "../../../utils/Store";
// import Layout from "../../../components/Layout";
// import useStyles from "../../../utils/styles";
// import { Controller, useForm } from "react-hook-form";
// import { useSnackbar } from "notistack";

// function reducer(state, action) {
//   switch (action.type) {
//     case "FETCH_REQUEST":
//       return { ...state, loading: true, error: "" };
//     case "FETCH_SUCCESS":
//       return { ...state, loading: false, error: "" };
//     case "FETCH_FAIL":
//       return { ...state, loading: false, error: action.payload };
//     case "UPDATE_REQUEST":
//       return { ...state, loadingUpdate: true, errorUpdate: "" };
//     case "UPDATE_SUCCESS":
//       return { ...state, loadingUpdate: false, errorUpdate: "" };
//     case "UPDATE_FAIL":
//       return { ...state, loadingUpdate: false, errorUpdate: action.payload };
//     case "UPLOAD_REQUEST":
//       return { ...state, loadingUpload: true, errorUpload: "" };
//     case "UPLOAD_SUCCESS":
//       return {
//         ...state,
//         loadingUpload: false,
//         errorUpload: "",
//       };
//     case "UPLOAD_FAIL":
//       return { ...state, loadingUpload: false, errorUpload: action.payload };
//     default:
//       return state;
//   }
// }

// function UserEdit({ params }) {
//   const userId = params.id;
//   const { state } = useContext(Store);
//   const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
//     useReducer(reducer, {
//       loading: true,
//       error: "",
//     });
//   const {
//     handleSubmit,
//     control,
//     register,
//     formState: { errors },
//     setValue,
//   } = useForm();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const { enqueueSnackbar, closeSnackbar } = useSnackbar();
//   const router = useRouter();
//   const classes = useStyles();
//   const { userInfo } = state;
//   // console.log('userInfo', userInfo);
//   useEffect(() => {
//     if (!userInfo) {
//       return router.push("/login");
//     } else {
//       const fetchData = async () => {
//         try {
//           dispatch({ type: "FETCH_REQUEST" });
//           const { data } = await axios.get(`/api/admin/users/${userId}`, {
//             headers: { authorization: `Bearer ${userInfo.token}` },
//           });

//           setIsAdmin(data.isAdmin);
//           dispatch({ type: "FETCH_SUCCESS" });
//           setValue("name", data.name);
//         } catch (err) {
//           dispatch({ type: "FETCH_FAIL", payload: getError(err) });
//         }
//       };
//       fetchData();
//     }
//   }, []);

//   const submitHandler = async ({ name }) => {
//     closeSnackbar();
//     try {
//       dispatch({ type: "UPDATE_REQUEST" });
//       await axios.put(
//         `/api/admin/users/${userId}`,
//         {
//           name,
//           isAdmin,
//         },
//         { headers: { authorization: `Bearer ${userInfo.token}` } }
//       );
//       dispatch({ type: "UPDATE_SUCCESS" });
//       enqueueSnackbar("User updated successfully", { variant: "success" });
//       router.push("/admin/users");
//     } catch (err) {
//       dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
//       enqueueSnackbar(getError(err), { variant: "error" });
//     }
//   };
//   return (
//     <Layout title={`Edit User ${userId}`}>
//       <div className="flex items-center justify-center min-h-screen overflow-x-hidden lg:overflow-x-auto lg:overflow-hidden">
//         <div className="flex flex-col flex-wrap justify-between w-full login-container lg:w-4/5 lg:flex-nowrap lg:flex-row group">
//           <div className="order-1 w-full min-h-screen lg:order-2">
//             <div className="relative flex items-center min-h-screen px-10 pt-16 form-wrapper lg:pt-0">
//               <div className="w-full space-y-2">
//                 <div className="flex items-end justify-center mb-8 space-x-3 text-center form-caption">
//                   <span className="text-3xl font-semibold text-royal-blue">
//                     Course Update
//                   </span>
//                 </div>
//                 <form onSubmit={handleSubmit(submitHandler)}>
//                   <div className="form-element">
//                     <label className="space-y-0.5 w-full lg:w-4/5 block mx-auto">
//                       <span className="block text-lg tracking-wide text-gray-800">
//                         Title
//                       </span>
//                       <span className="block">
//                         <input
//                           type="text"
//                           name="name"
//                           // eslint-disable-next-line react/jsx-props-no-spreading
//                           {...register("name", {
//                             required: {
//                               value: true,
//                               message: "You most enter name",
//                             },
//                           })}
//                           className={`block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-md shadow focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2
//                ${errors.name ? "ring-2 ring-red-500" : null}`}
//                         />
//                         <span className="py-2 text-sm text-red-400">
//                           {errors?.name?.message}
//                         </span>
//                       </span>
//                     </label>
//                   </div>

//                   <div className="form-element">
//                     <span className="block w-full mx-auto my-4 lg:w-4/5 ">
//                       <input
//                         type="submit"
//                         className="flex w-full px-6 py-3 text-lg text-white bg-indigo-600 border-0 rounded cursor-pointer focus:outline-none hover:bg-aquamarine-800"
//                         value="Update Account"
//                       ></input>
//                     </span>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }

// export async function getServerSideProps({ params }) {
//   return {
//     props: { params },
//   };
// }

// export default dynamic(() => Promise.resolve(UserEdit), { ssr: false });
