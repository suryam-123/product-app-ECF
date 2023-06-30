import React, { createContext, useState } from "react";

// Create the context
const MyContext = createContext();

// Create a provider component
const MyContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [detail, setDetail] = useState({
    title: "",
    description: "",
    price: 0,
    stock: 0,
    brand: "",
    thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
    discountPercentage: 0,
    category: "",
    images: ["https://i.dummyjson.com/data/products/1/thumbnail.jpg"],
  });
  // Provide the states and update functions through the context
  const contextValues = {
    products,
    setProducts,
    recentProducts,
    setRecentProducts,
    detail,
    setDetail,
  };

  return (
    <MyContext.Provider value={contextValues}>{children}</MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
