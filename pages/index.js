import {
  Grid,
} from "@material-ui/core";
import Layout from "../components/Layout";
import db from "../utils/db";
import Product from "../models/Product";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import ProductItem from '../components/ProductItem';

export default function Home(props) {
  const { products } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };

  return (
    <Layout>
      <div className="my-10">
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={3} sm={6} key={product.name}>
              <ProductItem
                product={product}
                addToCartHandler={addToCartHandler}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  // const products = await Product.find({}).lean();
  const products = await Product.find({}, '-reviews').lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
