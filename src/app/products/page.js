"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter, useSearchParams } from "next/navigation";
// import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "./ProductContextProvider";
// export const ProductList = createContext([]);
export default function Page() {
  const {
    products,
    setProducts,
    recentProducts,
    setRecentProducts,
    detail,
    setDetail,
  } = useContext(MyContext);
  // const [isLoading, setIsLoading] = useState(false);
  let router = useRouter();
  let search = useSearchParams();
  let title = "All products";
  if (search.get("page") === "recent") {
    title = "Recent Products";
    // limit = 5;
  }
  const limit = 30;
  useEffect(() => {
    const isDataFetched = products && products.length > 0;
    const fetchProducts = async () => {
      let skip = 0;
      let hasMoreProducts = true;
      let allProducts = [];

      while (hasMoreProducts) {
        const response = await fetch(
          `https://dummyjson.com/products?skip=${skip}&limit=${limit}`
        );
        const productData = await response.json();
        allProducts = [...allProducts, ...productData["products"]];
        skip += limit;
        hasMoreProducts = productData["products"].length === limit;
      }
      setRecentProducts(allProducts.slice(0, 5));
      setProducts(allProducts);
    };
    if (!isDataFetched) {
      fetchProducts();
    }
  }, []);
  const handleDelete = async (param) => {
    // setIsLoading(true);
    try {
      await fetch(`https://dummyjson.com/products/${param}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.filter(
          (item) => item.id !== param
        );
        setRecentProducts(updatedProducts.slice(0, 5));
        return updatedProducts;
      });
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return (
    <>
      <h1>{title}</h1>
      <div className={styles["grid"]}>
        {title === "Recent Products"
          ? recentProducts &&
            recentProducts.length > 0 &&
            recentProducts.map((item, index) => (
              <div key={index} className={styles["card"]}>
                <div
                  onClick={() => {
                    setDetail(item);
                    router.push(`/products/view?id=${item["id"]}`);
                  }}
                >
                  <Image
                    className={styles.cardimg}
                    src={item.thumbnail}
                    alt="No Image"
                    height={150}
                    width={230}
                  />
                  <div className={styles.cardinfo}>
                    <p className={styles.texttitle}>{item.title}</p>
                  </div>
                </div>
                <div className={styles.cardfooter}>
                  <span className={styles.texttitle}>${item.price}</span>
                  <span className={styles.texttitle} title="Discount">
                    {item.discountPercentage}%
                  </span>
                  <button
                    className={styles.cardbutton}
                    onClick={() => {
                      handleDelete(item.id);
                    }}
                    // disabled={isLoading}
                  >
                    Delete
                  </button>
                  <button
                    className={styles.cardbutton}
                    onClick={() => {
                      setDetail(item);
                      router.push(`/products/edit?id=${item["id"]}`);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          : products &&
            products.map((item, index) => (
              <div key={index} className={styles["card"]}>
                <div
                  onClick={() => {
                    setDetail(item);
                    router.push(`/products/view?id=${item["id"]}`);
                  }}
                >
                  <Image
                    className={styles.cardimg}
                    src={item.thumbnail}
                    alt="No Image"
                    height={150}
                    width={230}
                  />
                  <div className={styles.cardinfo}>
                    <p className={styles.texttitle}>{item.title}</p>
                  </div>
                </div>
                <div className={styles.cardfooter}>
                  <span className={styles.texttitle}>${item.price}</span>
                  <span className={styles.texttitle} title="Discount">
                    {item.discountPercentage}%
                  </span>
                  <button
                    className={styles.cardbutton}
                    onClick={() => {
                      handleDelete(item.id);
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className={styles.cardbutton}
                    onClick={() => {
                      setDetail(item);
                      router.push(`/products/edit?id=${item["id"]}`);
                    }}
                  >
                    {" "}
                    Edit
                  </button>
                </div>
              </div>
            ))}
      </div>
    </>
  );
}
