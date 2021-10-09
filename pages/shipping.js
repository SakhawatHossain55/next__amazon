/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { Store } from "../utils/Store";

export default function shipping() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  if (!userInfo) {
    router.push("/login?redirect=/shipping");
  }
  return <div>shipping</div>;
}
