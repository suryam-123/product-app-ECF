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
    thumbnail: "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png",
    discountPercentage: 0,
    category: "",
    images: ["https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.png"],
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
