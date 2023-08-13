import React, { useEffect, useState } from "react";
import { Container, Row, Button, Form, InputGroup } from "react-bootstrap";
import Coverflow from "reactjs-coverflow";
import { StyleRoot } from "radium";
import axiosInstance from "../utils/axiosConfig";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/AuthSlice";

function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axiosInstance
      .post("/login", {})
      .then((resp) => {
        if (typeof resp.data === "boolean") {
          dispatch(login());
        }
      })
      .catch((error) => {
        navigate("/login");
      });

    // Fetch cart items
    axiosInstance
      .get("/cart")
      .then((response) => {
        setCartItems(response.data);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch latest products
    axiosInstance
      .get("/products/latest")
      .then((response) => {
        setLatestProducts([...response.data]);
      })
      .catch((error) => {
        console.error("Error fetching latest products:", error);
      });
    fetchAllProducts();
  }, []);

  const fetchAllProducts = () => {
    // Fetch all products
    axiosInstance
      .get("/products")
      .then((response) => {
        setAllProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching all products:", error);
      });
  };

  const handleClick = (id) => {
    navigate(`/product/${id}`);
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

  const increaseQuantity = (e, productId, quantity) => {
    e.preventDefault();
    e.stopPropagation();

    const product = allProducts.find((prod) => prod._id === productId);
    if (!product) {
      return;
    }

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

  const handleSearch = () => {
    if (!searchTerm) return;
    axiosInstance
      .get(`/product/search/${searchTerm}`)
      .then((response) => {
        // Process the response
        setAllProducts([...response.data]);
      })
      .catch((error) => {
        console.error("Error searching products:", error);
      });
  };

  const handleClear = () => {
    setSearchTerm("");
    fetchAllProducts();
  };

  return (
    <Container className="m-0 p-0 mw-100">
      <Form.Group controlId="searchFilter" className="m-3">
        <InputGroup>
          <Form.Control
            type="text"
            className="w-75 b-0 shadow-none"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            as="InputGroup.Append"
            variant="primary"
            onClick={handleSearch}
          >
            Search
          </Button>

          <Button
            as="InputGroup.Append"
            variant="secondary"
            onClick={handleClear}
          >
            Clear
          </Button>
        </InputGroup>
      </Form.Group>

      {/* Latest Products */}
      <h2 className="text-center">Latest Products</h2>
      <Row>
        <StyleRoot>
          <Coverflow
            style={{ width: "100vw", height: "500px" }}
            startPosition={4}
            enableScroll={true}
            rotate={30}
            animationSpeed={0.7}
          >
            {latestProducts.map((product, index) =>
              index === 0 ? (
                <div
                  key={product._id}
                  onClick={handleClick.bind(this, product._id)}
                >
                  <img
                    height={300}
                    width={300}
                    src={`data:image/jpeg;base64,${product.image}`}
                    alt={product.name}
                    className="object-fit-cover object-position-center"
                  />
                </div>
              ) : (
                <img
                  height={300}
                  width={300}
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.name}
                  className="object-fit-cover object-position-center"
                />
              )
            )}
          </Coverflow>
        </StyleRoot>
      </Row>

      {/* All Products */}
      <h2 className="my-3 text-center">All Products</h2>
      <div className="row row-cols-1 row-cols-md-3">
        {allProducts.map((product) => (
          <div className="col mb-4" key={product._id}>
            <Card style={{ cursor: "pointer" }}>
              <Card.Img
                onClick={handleClick.bind(this, product._id)}
                variant="top"
                src={`data:image/jpeg;base64,${product.image}`}
                height={300}
                className={"object-fit-cover object-position-center"}
                alt={product.name}
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.desc}</Card.Text>
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
        ))}
      </div>
    </Container>
  );
}

export default Home;
