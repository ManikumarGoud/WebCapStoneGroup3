import React, { Fragment, useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Modal } from "react-bootstrap";
import { BsTrashFill, BsPlus, BsDash } from "react-icons/bs";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/AuthSlice";
import { toast } from "react-toastify";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
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
    fetchCartProducts();
  }, []);

  const fetchCartProducts = () => {
    axiosInstance
      .get("/cart")
      .then((response) => {
        setCartItems([...response.data]);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  };

  const handleDelete = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    axiosInstance
      .delete(`/cart/remove/${productId}`)
      .then(() => {
        fetchCartProducts();
      })
      .catch((error) => {
        console.error("Error deleting cart item:", error);
      });
  };

  const handleQuantityChange = (e, productId, type) => {
    e.preventDefault();
    e.stopPropagation();
    axiosInstance
      .post(`/cart/${type}/${productId}`)
      .then(() => {
        fetchCartProducts();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handlePayConfirmation = () => {
    setShowModal(true);
  };

  const handleConfirmPayment = () => {
    navigate("/checkout");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container
      className={cartItems.length > 0 ? "" : "d-flex flex-direction-column"}
    >
      <h2 className="mt-4 mb-3">Cart</h2>
      {cartItems.length > 0 ? (
        <Fragment>
          <Row>
            {cartItems.map((item) => (
              <Col md={4} key={item.id} className="mb-3">
                <Card className="p-3 shadow-sm">
                  <img
                    src={`data:image/jpeg;base64,${item.image}`}
                    alt={item.name}
                    className="mb-3"
                  />
                  <h5>{item.name}</h5>
                  <p>Price: ${item.price}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button
                      variant="danger"
                      onClick={(e) => handleDelete(e, item.id)}
                    >
                      <BsTrashFill />
                    </Button>
                    <div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) =>
                          handleQuantityChange(e, item.id, "decrease")
                        }
                      >
                        <BsDash />
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) =>
                          handleQuantityChange(e, item.id, "increase")
                        }
                      >
                        <BsPlus />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-end my-3">
            <div>
              <Button variant="primary" onClick={handlePayConfirmation}>
                Pay: ${calculateTotalPrice().toFixed(2)}
              </Button>
            </div>
          </div>
        </Fragment>
      ) : (
        <h3 className="vh-75 d-flex flex-grow-1 align-items-center justify-content-center">
          Cart is Empty
        </h3>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you want to proceed with payment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            No
          </Button>
          <Button variant="primary" onClick={handleConfirmPayment}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Cart;
