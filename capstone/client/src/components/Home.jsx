import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import Coverflow from "reactjs-coverflow";
import "slick-carousel/slick/slick-theme.css";
import { StyleRoot } from "radium";

function Home() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch latest products
    axios
      .get("/api/products/latest")
      .then((response) => {
        setLatestProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching latest products:", error);
      });

    // Fetch best deals
    axios
      .get("/api/products/best-deals")
      .then((response) => {
        setBestDeals(response.data);
      })
      .catch((error) => {
        console.error("Error fetching best deals:", error);
      });

    // Fetch all products
    axios
      .get("/api/products")
      .then((response) => {
        setAllProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching all products:", error);
      });
  }, []);

  const dummyProducts = [
    {
      id: 1,
      name: "Product 1",
      image: "https://via.placeholder.com/300x200?text=Product+1",
    },
    {
      id: 2,
      name: "Product 2",
      image: "https://via.placeholder.com/300x200?text=Product+2",
    },
    {
      id: 3,
      name: "Product 3",
      image: "https://via.placeholder.com/300x200?text=Product+3",
    },
    {
      id: 4,
      name: "Product 4",
      image: "https://via.placeholder.com/300x200?text=Product+4",
    },
    {
      id: 5,
      name: "Product 5",
      image: "https://via.placeholder.com/300x200?text=Product+5",
    },
    {
      id: 6,
      name: "Product 6",
      image: "https://via.placeholder.com/300x200?text=Product+6",
    },
    {
      id: 7,
      name: "Product 7",
      image: "https://via.placeholder.com/300x200?text=Product+7",
    },
    {
      id: 8,
      name: "Product 8",
      image: "https://via.placeholder.com/300x200?text=Product+8",
    },
    {
      id: 9,
      name: "Product 9",
      image: "https://via.placeholder.com/300x200?text=Product+9",
    },
    {
      id: 10,
      name: "Product 10",
      image: "https://via.placeholder.com/300x200?text=Product+10",
    },
  ];

  const renderLatestProducts = () => {
    // Dummy product data

    return dummyProducts.map((product) => (
      <div key={product.id}>
        <img src={product.image} alt={product.name} />
      </div>
    ));
  };

  var fn = function () {
    /* do you want */
  };

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    dots: true,
  };
  return (
    <Container>
      <Form.Group controlId="searchFilter" className="my-3">
        <Form.Control
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>

      {/* Latest Products */}
      <h2 className="text-center">Latest Products</h2>
      <Row>
        <Col>
          <Slider {...settings}>{renderLatestProducts()}</Slider>
        </Col>
      </Row>

      {/* Best Deals */}
      <h2>Best Deals</h2>
      <Row>
        <StyleRoot>
          <Coverflow
            displayQuantityOfSide={2}
            navigation
            infiniteScroll
            enableHeading
            media={{
              "@media (max-width: 900px)": {
                width: "600px",
                height: "300px",
              },
              "@media (min-width: 900px)": {
                width: "960px",
                height: "600px",
              },
            }}
          >
            {renderLatestProducts()}
          </Coverflow>
        </StyleRoot>
      </Row>

      {/* All Products */}
      <h2>All Products</h2>
      <Row>{/* Render all products */}</Row>

      {/* Show More Button */}
      <Row>
        <Col className="text-center mt-4">
          <Button variant="primary">Show More</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
