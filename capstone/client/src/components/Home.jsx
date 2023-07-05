import React, { useEffect, useState } from "react";
import { Container, Row, Button, Form, InputGroup } from "react-bootstrap";
import Coverflow from "reactjs-coverflow";
import { StyleRoot } from "radium";
import axiosInstance from "../utils/axiosConfig";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../store/slice/AuthSlice";

function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   axiosInstance
  //     .post("/login", {})
  //     .then((resp) => {
  //       if (typeof resp.data !== "boolean") {
  //         toast.error("Session Expired!!");
  //       } else {
  //         dispatch(login());
  //         navigate("/");
  //       }
  //     })
  //     .catch((error) => {});
  // }, []);

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

    // Fetch all products
    axiosInstance
      .get("/products")
      .then((response) => {
        setAllProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching all products:", error);
      });
  }, []);

  const handleClick = (id) => {};
  const addToCart = (id) => {};
  const handleSearch = () => {};

  return (
    <Container className="m-0 p-0 mw-100">
      <Form.Group controlId="searchFilter" className="m-3">
        <InputGroup>
          <Form.Control
            type="text"
            className="w-75"
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
            <Card>
              <Card.Img
                variant="top"
                src={`data:image/jpeg;base64,${product.image}`}
                height={300}
                className={"object-fit-cover object-position-center"}
                alt={product.name}
              />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.desc}</Card.Text>
                <Button
                  className="error"
                  onClick={() => handleClick(product._id)}
                >
                  Buy
                </Button>
                <Button className="mx-1" onClick={() => addToCart(product._id)}>
                  Add to Cart
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default Home;
