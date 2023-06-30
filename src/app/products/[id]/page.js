"use client";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import { ProductList } from "../page";
import _ from "lodash";
import { MyContext } from "../ProductContextProvider";
export default function Page({ params: { id } }) {
  const {
    products,
    setProducts,
    recentProducts,
    setRecentProducts,
    detail,
    setDetail,
  } = useContext(MyContext);
  const [readOnly, setReadOnly] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  let searchParam = useSearchParams();
  let router = useRouter();
  let param = "";
  if (id != "new") {
    param = searchParam.get("id");
  }
  useEffect(() => {
    setReadOnly(id === "view");
    if (id === "new") {
      setDetail({
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
    }
  }, [id, setDetail]);
  const handleChange = (name, value) => {
    setDetail((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://dummyjson.com/products/${
          id === "new" ? "add" : Number(param)
        }`,
        {
          method: id === "new" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT, PATCH",
          },
          body: JSON.stringify(detail),
        }
      );
      const data = await response.json();

      if (id == "new") {
        setProducts((prevProducts) => {
          data["id"] = _.maxBy(prevProducts, "id")["id"] + 1;
          data["discountPercentage"] = detail["discountPercentage"];
          prevProducts.unshift(data);
          setRecentProducts(prevProducts.slice(0, 5));
          return prevProducts;
        });
      } else {
        setProducts((prevProducts) => {
          let updatedProducts = prevProducts.filter(
            (item) => item.id !== Number(param)
          );
          updatedProducts.unshift(detail);
          setRecentProducts(updatedProducts.slice(0, 5));
          return updatedProducts;
        });
      }

      // router.push(`/products`);
      router.push(`/products/view?id=${param}`);
      // ...
    } catch (error) {
      // setMessage("An error occurred. Please try again.");
      // Clear the form
    }
  };
  return (
    <>
      <style jsx>
        {`
          .container {
            display: flex;
            align-items: flex-start;
            font-family: Arial, sans-serif;
          }
          .imgcard {
            flex: 1;
            padding: 20px;
            align-items: center;
          }

          .imgcard .card {
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 20px;
            background-color: #f9f9f9;
          }

          .imgcard .card img {
            display: none;
            max-width: 100%;
            height: auto;
            margin-bottom: 10px;
          }

          .imgcard .card h2 {
            font-size: 20px;
            margin-bottom: 10px;
          }
          .imgcard .card img.active {
            display: block;
          }
          .imgcard .card p {
            margin-bottom: 20px;
          }

          .imgcard .card .controls {
            margin-top: 10px;
          }

          .form {
            flex: 1;
            padding: 20px;
          }

          .form .card {
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 20px;
            background-color: #f9f9f9;
          }

          .form .card h2 {
            font-size: 20px;
            margin-bottom: 10px;
          }
          .slideshow {
            position: relative;
            width: 300px;
            height: 300px;
          }
          #slideshow {
            position: relative;
            width: 100%;
            height: 100%;
          }
          #slideshow :global(img) {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            transition: opacity 1s ease-in-out;
          }
          #slideshow :global(img.active) {
            opacity: 1;
          }

          .form label {
            display: block;
            margin-top: 10px;
            font-weight: bold;
          }

          .form input[type="text"],
          .form input[type="number"],
          .form input[type="decimal"],
          .form textarea {
            width: 100%;
            padding: 5px;
            font-size: 14px;
            /* border: 1px solid #ccc; */
            border: none;
          }

          .form input[type="submit"] {
            background-color: #4caf50;
            color: #fff;
            padding: 10px 15px;
            border: none;
            cursor: pointer;
            margin-top: 10px;
          }

          .form input[type="submit"]:hover {
            background-color: #45a049;
          }
        `}
      </style>
      <div className="container">
        <div className="imgcard">
          <div className="card">
            <h2>Image Slideshow</h2>
            <div className="slideshow">
              <div id="slideshow">
                {detail.images &&
                  detail.images.map((img, index) => {
                    return (
                      <Image
                        src={img}
                        key={index}
                        height={300}
                        width={300}
                        alt={"Image" + index}
                        className={index === activeIndex ? "active" : ""}
                      />
                    );
                  })}
              </div>
            </div>
            <div className="controls">
              <button
                onClick={() =>
                  setActiveIndex(
                    (activeIndex + detail.images.length - 1) %
                      detail.images.length
                  )
                }
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setActiveIndex((activeIndex + 1) % detail.images.length)
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="form">
          <div className="card">
            <h2>Details</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={detail.title}
                onChange={(event) =>
                  handleChange(event.target.name, event.target.value)
                }
                readOnly={readOnly}
              />
              <label htmlFor="price">Price:</label>
              <input
                type="decimal"
                id="price"
                name="price"
                required
                value={detail.price}
                onChange={(event) =>
                  handleChange(event.target.name, event.target.value)
                }
                readOnly={readOnly}
              />
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                cols="30"
                value={detail.description}
                onChange={(event) =>
                  handleChange(event.target.name, event.target.value)
                }
                readOnly={readOnly}
              ></textarea>
              <label htmlFor="discountPercentage">Discount:</label>
              <input
                type="decimal"
                id="discountPercentage"
                name="discountPercentage"
                required
                value={detail.discountPercentage}
                onChange={(event) =>
                  handleChange(event.target.name, event.target.value)
                }
                readOnly={readOnly}
              />
              <label htmlFor="category">Category:</label>
              <input
                type="text"
                id="category"
                name="category"
                value={detail.category}
                onChange={(event) =>
                  handleChange(event.target.name, event.target.value)
                }
                readOnly={readOnly}
              />
              <label htmlFor="brand">Brand:</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={detail.brand}
                onChange={(event) =>
                  handleChange(event.target.name, event.target.value)
                }
                readOnly={readOnly}
              />
              <label htmlFor="stock">Stock:</label>
              <input
                type="number"
                id="stock"
                name="stock"
                required
                value={detail.stock}
                onChange={(event) =>
                  handleChange(event.target.name, event.target.value)
                }
                readOnly={readOnly}
              />
              <br />
              {!readOnly && <input type="submit" value="Submit" />}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
