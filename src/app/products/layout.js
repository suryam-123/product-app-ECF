"use client";
import styles from "./page.module.css";
import Link from "next/link";
import Loading from "../loading";
import { Suspense } from "react";
import { MyContextProvider } from "./ProductContextProvider";

export default function ProductListLayout({ children }) {
  return (
    <>
      <header>
        <h1>Product Shop</h1>
      </header>
      <nav>
        <ul className={styles.list}>
          <li className={styles.listitem}>
            <Link href="/products?page=recent">Home</Link>
          </li>
          <li className={styles.listitem}>
            <Link href="/products">View All Products</Link>
          </li>
          <li className={styles.listitem}>
            <Link href="/products/new">New Product</Link>
          </li>
        </ul>
      </nav>
      <MyContextProvider>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </MyContextProvider>
    </>
  );
}
