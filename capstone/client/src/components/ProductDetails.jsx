import React, { Fragment } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import axiosInstance from "../utils/axiosConfig";
import { login } from "../store/slice/AuthSlice";

const ProductDetails = (props) => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [user, setUser] = useState({});
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .post("/login", {})
      .then((resp) => {
        if (typeof resp.data === "boolean") {
          dispatch(login());
        }
      })
      .catch((error) => {
        toast.error("Session Expired!!");
        navigate("/login");
      });
    fetchAllProducts();
  }, []);

  const fetchAllProducts = () => {
    axiosInstance
      .get(`/product/${id}`)
      .then((response) => {
        setIsLoading(false);
        setProduct({ ...response.data.product });
        setUser({ ...response.data.user });
      })
      .catch((error) => {
        console.error("Error fetching latest products:", error);
      });
  };

  const handleMouseOver = (e) => {
    setIsZoomed(true);
    setMousePosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  };

  const handleMouseOut = () => {
    setIsZoomed(false);
  };

  const increaseQuantity = (e, productId, quantity) => {
    e.preventDefault();
    e.stopPropagation();

    if (quantity < product.quantity) {
      axiosInstance
        .post(`/cart/increase/${productId}`)
        .then(() => {
          // Refresh cart items after increasing quantity
          fetchAllProducts();
        })
        .catch((error) => {
          console.error("Error increasing quantity:", error);
        });
    } else {
      console.error("Cannot increase quantity further");
    }
  };

  const decreaseQuantity = (e, productId, quantity) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      axiosInstance
        .post(`/cart/decrease/${productId}`)
        .then(() => {
          // Refresh cart items after decreasing quantity
          fetchAllProducts();
        })
        .catch((error) => {
          console.error("Error decreasing quantity:", error);
        });
    } else {
      // If the quantity is already 1, remove the product from the cart
      axiosInstance
        .delete(`/cart/remove/${productId}`)
        .then(() => {
          // Refresh cart items after removing from cart
          fetchAllProducts();
        })
        .catch((error) => {
          console.error("Error removing from cart:", error);
        });
    }
  };

  const addToCart = (e, id, quantity) => {
    e.preventDefault();
    e.stopPropagation();
    axiosInstance
      .post(`/cart/increase/${id}`)
      .then(() => {
        // Refresh cart items after adding to cart
        fetchAllProducts();
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
      });
  };

  return (
    <div className="row">
      {isLoading ? (
        <Spinner animation="border" />
      ) : (
        <Fragment>
          <div className="col-md-6 p-0">
            <div
              className="zoom-container"
              onMouseMove={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              {isZoomed ? (
                <Fragment>
                  <div
                    className="zoomed-image"
                    style={{
                      backgroundImage: `url(data:image/jpeg;base64,${product.image})`,
                      backgroundPosition: `${-mousePosition.x * 2}px ${
                        -mousePosition.y * 2
                      }px`,
                      backgroundSize: "300% 300%",
                    }}
                  />
                  <img
                    src={`data:image/jpeg;base64,${product.image}`}
                    alt={product.name}
                    className="img-fluid"
                  />
                </Fragment>
              ) : (
                <img
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.name}
                  className="img-fluid"
                />
              )}
            </div>
          </div>
          <div className="col-md-6 p-0">
            <Card>
              <Card.Body>
                <Card.Title>{`Name: ${product.name}`}</Card.Title>
                <Card.Text>{`Description: ${product.desc}`}</Card.Text>
                <Card.Text>{`Price: $${product.price} CAD`}</Card.Text>
                <Card.Text>{`Added By: ${user.lastName}, ${user.firstName}`}</Card.Text>
                {product.quantityInCart > 0 ? (
                  <>
                    <Button
                      className="mx-1"
                      onClick={(e) =>
                        decreaseQuantity(
                          e,
                          product._id,
                          product.quantityInCart - 1
                        )
                      }
                    >
                      -
                    </Button>
                    <span className="mx-1">{product.quantityInCart}</span>
                    <Button
                      className="mx-1"
                      onClick={(e) =>
                        increaseQuantity(
                          e,
                          product._id,
                          product.quantityInCart + 1
                        )
                      }
                    >
                      +
                    </Button>
                  </>
                ) : (
                  <Button
                    className="mx-1"
                    onClick={(e) => addToCart(e, product._id, 1)}
                  >
                    Add to Cart
                  </Button>
                )}
              </Card.Body>
            </Card>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default ProductDetails;
