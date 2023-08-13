import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Container,
  Row,
  Col,
  Modal,
  Button,
  Form as BootstrapForm,
} from "react-bootstrap";
import { useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/AuthSlice";
import { toast } from "react-toastify";

function Checkout() {
  const CheckoutSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, "First name must be at least 3 characters")
      .required("First name is required"),
    lastName: Yup.string()
      .min(3, "Last name must be at least 3 characters")
      .required("Last name is required"),
    addressLine1: Yup.string().required("Address line 1 is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    province: Yup.string().required("Province is required"),
    zipCode: Yup.string()
      .matches(
        /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
        "Zip code must be in format N1N 2J3"
      )
      .required("Zip code is required"),

    cardNumber: Yup.string()
      .matches(/^\d{16}$/, "Card number must be 16 digits")
      .required("Card number is required"),
    cardName: Yup.string()
      .min(3, "Card name must be at least 3 characters")
      .required("Card name is required"),
    expiry: Yup.string()
      .test("expiry", "Expiry date must be in the future", function (value) {
        if (!value) {
          return false;
        }

        const [expMonth, expYear] = value.split("/").map(Number);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (
          expYear < currentYear ||
          (expYear === currentYear && expMonth < currentMonth)
        ) {
          return false;
        }

        return true;
      })
      .matches(
        /^(0[1-9]|1[0-2])\/\d{2}$/,
        "Expiry date must be in format MM/YY"
      )
      .required("Expiry date is required"),
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

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

    axiosInstance.get("/cart").then((response) => {
      setCartProducts(response.data);
      const totalPrice = response.data.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
      setTotalAmount(totalPrice);
    });
  }, []);

  const handleCheckout = async () => {
    try {
      const response = await axiosInstance.post("/checkout", {});

      if (response.status === 200) {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Payment failed");
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Checkout</h2>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          zipCode: "",
          province: "",
          country: "",
          cardNumber: "",
          cardName: "",
          expiry: "",
          cvv: "",
        }}
        validationSchema={CheckoutSchema}
        onSubmit={(values) => {
          handleCheckout(values);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <Row>
              <Col md={6}>
                <h4>Personal Information</h4>
                <BootstrapForm.Group controlId="firstName">
                  <BootstrapForm.Label>First Name</BootstrapForm.Label>
                  <Field
                    name="firstName"
                    as={BootstrapForm.Control}
                    className={
                      errors.firstName && touched.firstName ? "is-invalid" : ""
                    }
                  />
                  <div className="invalid-feedback">{errors.firstName}</div>
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="lastName">
                  <BootstrapForm.Label>Last Name</BootstrapForm.Label>
                  <Field
                    name="lastName"
                    as={BootstrapForm.Control}
                    className={
                      errors.lastName && touched.lastName ? "is-invalid" : ""
                    }
                  />
                  <div className="invalid-feedback">{errors.lastName}</div>
                </BootstrapForm.Group>
              </Col>
              <Col className=" ms-5 d-flex flex-column justify-content-center">
                <h4>Cart Summary</h4>
                <ul>
                  {cartProducts.map((product) => (
                    <li key={product.id}>
                      {product.name} - {product.quantity} x ${product.price}
                    </li>
                  ))}
                </ul>
                <p>Total Amount: ${totalAmount.toFixed(2)}</p>
                <p>Tax (15%): ${(totalAmount * 0.15).toFixed(2)}</p>
                <p>Total Due: ${(totalAmount * 1.15).toFixed(2)}</p>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col md={6}>
                <h4>Address Information</h4>
                <BootstrapForm.Group controlId="addressLine1">
                  <BootstrapForm.Label>Address Line 1</BootstrapForm.Label>
                  <Field
                    name="addressLine1"
                    as={BootstrapForm.Control}
                    className={
                      errors.addressLine1 && touched.addressLine1
                        ? "is-invalid"
                        : ""
                    }
                  />
                  <div className="invalid-feedback">{errors.addressLine1}</div>
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="addressLine2">
                  <BootstrapForm.Label>Address Line 2</BootstrapForm.Label>
                  <Field
                    name="addressLine2"
                    as={BootstrapForm.Control}
                    className={
                      errors.addressLine2 && touched.addressLine2
                        ? "is-invalid"
                        : ""
                    }
                  />
                  <div className="invalid-feedback">{errors.addressLine2}</div>
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="city">
                  <BootstrapForm.Label>City</BootstrapForm.Label>
                  <Field
                    name="city"
                    as={BootstrapForm.Control}
                    className={errors.city && touched.city ? "is-invalid" : ""}
                  />
                  <div className="invalid-feedback">{errors.city}</div>
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="zipCode">
                  <BootstrapForm.Label>Zip Code</BootstrapForm.Label>
                  <Field
                    name="zipCode"
                    as={BootstrapForm.Control}
                    className={
                      errors.zipCode && touched.zipCode ? "is-invalid" : ""
                    }
                  />
                  <div className="invalid-feedback">{errors.zipCode}</div>
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="province">
                  <BootstrapForm.Label>Province</BootstrapForm.Label>
                  <Field
                    name="province"
                    as={BootstrapForm.Control}
                    className={
                      errors.province && touched.province ? "is-invalid" : ""
                    }
                  />
                  <div className="invalid-feedback">{errors.province}</div>
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="country">
                  <BootstrapForm.Label>Country</BootstrapForm.Label>
                  <Field
                    name="country"
                    as={BootstrapForm.Control}
                    className={
                      errors.country && touched.country ? "is-invalid" : ""
                    }
                  />
                  <div className="invalid-feedback">{errors.country}</div>
                </BootstrapForm.Group>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <h4>Enter Card Details</h4>
                <BootstrapForm.Group controlId="cardNumber">
                  <BootstrapForm.Label>Card Number</BootstrapForm.Label>
                  <Field
                    name="cardNumber"
                    as={BootstrapForm.Control}
                    className={
                      errors.cardNumber && touched.cardNumber
                        ? "is-invalid"
                        : ""
                    }
                  />
                  <div className="invalid-feedback">{errors.cardNumber}</div>
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="cardName">
                  <BootstrapForm.Label>Card Name</BootstrapForm.Label>
                  <Field
                    name="cardName"
                    as={BootstrapForm.Control}
                    className={
                      errors.cardName && touched.cardName ? "is-invalid" : ""
                    }
                  />
                  <div className="invalid-feedback">{errors.cardName}</div>
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="expiry">
                  <BootstrapForm.Label>Expiry (MM/YY)</BootstrapForm.Label>
                  <Field
                    name="expiry"
                    as={BootstrapForm.Control}
                    className={
                      errors.expiry && touched.expiry ? "is-invalid" : ""
                    }
                  />
                  <div className="invalid-feedback">{errors.expiry}</div>
                </BootstrapForm.Group>
                <BootstrapForm.Group controlId="cvv">
                  <BootstrapForm.Label>CVV</BootstrapForm.Label>
                  <Field
                    name="cvv"
                    as={BootstrapForm.Control}
                    className={errors.cvv && touched.cvv ? "is-invalid" : ""}
                  />
                  <div className="invalid-feedback">{errors.cvv}</div>
                </BootstrapForm.Group>
              </Col>
            </Row>
            <div className="text-center mt-4">
              <Button type="submit">Checkout</Button>
            </div>
          </Form>
        )}
      </Formik>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your payment was successful.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => navigate("/")}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Checkout;
