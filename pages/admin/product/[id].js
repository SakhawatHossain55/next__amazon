/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useContext, useReducer } from "react";
import { getError } from "../../../utils/error";
import { Store } from "../../../utils/Store";
import Layout from "../../../components/Layout";
import useStyles from "../../../utils/styles";
import { Controller, useForm } from "react-hook-form";

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

function ProductEdit({ params }) {
  const productId = params.id;
  const { state } = useContext(Store);
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setValue,
  } = useForm();
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
          const { data } = await axios.get(`/api/admin/products/${productId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: "FETCH_SUCCESS" });
          setValue("name", data.name);
          setValue("slug", data.slug);
          setValue("price", data.price);
          setValue("image", data.image);
          setValue("category", data.category);
          setValue("brand", data.brand);
          setValue("countInStock", data.countInStock);
          setValue("description", data.description);
        } catch (err) {
          dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        }
      };
      fetchData();
    }
  }, []);
  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/admin/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      setValue("image", data.secure_url);
      enqueueSnackbar("File uploaded successfully", { variant: "success" });
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
  }) => {
    closeSnackbar();
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/admin/products/${productId}`,
        {
          name,
          slug,
          price,
          category,
          image,
          brand,
          countInStock,
          description,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      enqueueSnackbar("Product updated successfully", { variant: "success" });
      router.push("/admin/products");
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  return (
    <Layout title={`Edit Product ${productId}`}>
      <div className="flex items-center justify-center min-h-screen overflow-x-hidden lg:overflow-x-auto lg:overflow-hidden">
        <div className="flex flex-col flex-wrap justify-between w-full login-container lg:w-4/5 lg:flex-nowrap lg:flex-row group">
          <div className="order-1 w-full min-h-screen lg:order-2">
            <div className="relative flex items-center min-h-screen px-10 pt-16 form-wrapper lg:pt-0">
              <div className="w-full space-y-2">
                <div className="flex items-end justify-center mb-8 space-x-3 text-center form-caption">
                  <span className="text-3xl font-semibold text-royal-blue">
                    Course Update
                  </span>
                </div>
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className="form-element">
                    <label className="space-y-0.5 w-full lg:w-4/5 block mx-auto">
                      <span className="block text-lg tracking-wide text-gray-800">
                        Title
                      </span>
                      <span className="block">
                        <input
                          type="text"
                          name="name"
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...register("name", {
                            required: {
                              value: true,
                              message: "You most enter name",
                            },
                          })}
                          className={`block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-md shadow focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2
               ${errors.name ? "ring-2 ring-red-500" : null}`}
                        />
                        <span className="py-2 text-sm text-red-400">
                          {errors?.name?.message}
                        </span>
                      </span>
                    </label>
                  </div>
                  <div className="form-element">
                    <label className="space-y-0.5 w-full lg:w-4/5 block mx-auto">
                      <span className="block text-lg tracking-wide text-gray-800">
                        Slug
                      </span>
                      <span className="block">
                        <input
                          type="text"
                          name="slug"
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...register("slug", {
                            required: {
                              value: true,
                              message: "You most enter slug",
                            },
                          })}
                          className={`block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-md shadow focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2
               ${errors.name ? "ring-2 ring-red-500" : null}`}
                        />
                        <span className="py-2 text-sm text-red-400">
                          {errors?.name?.message}
                        </span>
                      </span>
                    </label>
                  </div>
                  <div className="form-element">
                    <label className="space-y-0.5 w-full lg:w-4/5 block mx-auto">
                      <span className="block text-lg tracking-wide text-gray-800">
                        Category
                      </span>
                      <span className="block">
                        <input
                          type="text"
                          name="category"
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...register("category", {
                            required: {
                              value: true,
                              message: "You most enter category",
                            },
                          })}
                          className={`block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-md shadow focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2
               ${errors.name ? "ring-2 ring-red-500" : null}`}
                        />
                        <span className="py-2 text-sm text-red-400">
                          {errors?.name?.message}
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="form-element">
                    <label className="space-y-0.5 w-full lg:w-4/5 block mx-auto">
                      <span className="block text-lg tracking-wide text-gray-800">
                        Price
                      </span>
                      <span className="block">
                        <input
                          type="text"
                          name="price"
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...register("price", {
                            required: {
                              value: true,
                              message: "You most enter price",
                            },
                          })}
                          className={`block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-md shadow focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2
               ${errors.name ? "ring-2 ring-red-500" : null}`}
                        />
                        <span className="py-2 text-sm text-red-400">
                          {errors?.name?.message}
                        </span>
                      </span>
                    </label>
                  </div>
                  <div className="form-element">
                    <label className="space-y-0.5 w-full lg:w-4/5 block mx-auto">
                      <span className="block text-lg tracking-wide text-gray-800">
                        Brand
                      </span>
                      <span className="block">
                        <input
                          type="text"
                          name="brand"
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...register("brand", {
                            required: {
                              value: true,
                              message: "You most enter brand",
                            },
                          })}
                          className={`block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-md shadow focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2
               ${errors.name ? "ring-2 ring-red-500" : null}`}
                        />
                        <span className="py-2 text-sm text-red-400">
                          {errors?.name?.message}
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="form-element">
                    <label className="space-y-0.5 w-full lg:w-4/5 block mx-auto">
                      <span className="block text-lg tracking-wide text-gray-800">
                        Image
                      </span>
                      <span className="block">
                        <input
                          type="text"
                          name="image"
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...register("image", {
                            required: {
                              value: true,
                              message: "You most enter image",
                            },
                          })}
                          className={`block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-md shadow focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2
               ${errors.name ? "ring-2 ring-red-500" : null}`}
                        />
                        <span className="py-2 text-sm text-red-400">
                          {errors?.name?.message}
                        </span>
                      </span>
                    </label>
                  </div>
                  <button>
                    Upload File
                    <input type="file" onChange={uploadHandler} />
                  </button>
                  <div className="form-element">
                    <label className="space-y-0.5 w-full lg:w-4/5 block mx-auto">
                      <span className="block text-lg tracking-wide text-gray-800">
                        Description
                      </span>
                      <span className="block">
                        <input
                          type="text"
                          name="description"
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...register("description", {
                            required: {
                              value: true,
                              message: "You most enter description",
                            },
                          })}
                          className={`block w-full px-4 py-3 placeholder-gray-500 border-gray-300 rounded-md shadow focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2
               ${errors.name ? "ring-2 ring-red-500" : null}`}
                        />
                        <span className="py-2 text-sm text-red-400">
                          {errors?.name?.message}
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="form-element">
                    <span className="block w-full mx-auto my-4 lg:w-4/5 ">
                      <input
                        type="submit"
                        className="flex w-full px-6 py-3 text-lg text-white bg-indigo-600 border-0 rounded cursor-pointer focus:outline-none hover:bg-aquamarine-800"
                        value="Update Account"
                      ></input>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  return {
    props: { params },
  };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });
