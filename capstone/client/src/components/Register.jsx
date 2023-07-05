import React, { Fragment } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Row, Col, Container } from "react-bootstrap";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/AuthSlice";

const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState({});
  const dispatch = useDispatch();

  const schema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password")], "Password did not match"),
    dob: Yup.date()
      .required("DoB is required")
      .max(new Date(), "Invalid date of birth")
      .min(new Date(1900, 0, 1), "Invalid date of birth"),
  });

  const notifySuccess = () => {
    console.log("done");
    toast.success("Registration successful!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    dispatch(() => login());
    navigate("/login");
  };

  return (
    <Fragment>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          dob: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={schema}
        onSubmit={(values, { resetForm }) => {
          const { firstName, lastName, email, dob, password, confirmPassword } =
            values;
          axiosInstance
            .post("/register", {
              firstName,
              lastName,
              email,
              password,
              confirmPassword,
              dob,
            })
            .then((resp) => {
              if (typeof resp.data !== "boolean") {
                setErrorMessage((prevErrors) => ({
                  ...prevErrors,
                  ...resp.data.error,
                }));
              } else {
                resetForm();
                console.log("asdf");
                notifySuccess();
              }
            })
            .catch((error) => {
              setErrorMessage((prevErrors) => ({
                ...prevErrors,
                ...error.response.data,
              }));
            });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => {
          const handleFieldChange = () => {
            if (errorMessage) {
              setErrorMessage({});
            }
          };
          return (
            <Fragment>
              <Row className="register">
                <Col
                  md={6}
                  className="d-flex align-items-center image-container"
                ></Col>
                <Col
                  md={6}
                  className="d-flex flex-column justify-content-center"
                >
                  <Container className="p-5">
                    <h2 className="display-6 text-center text-uppercase mt-2">
                      Register
                    </h2>
                    <Form>
                      <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <Field
                          type="text"
                          id="firstName"
                          name="firstName"
                          placeholder="Enter your first name"
                          className={`mb-2 form-control ${
                            touched.firstName && errors.firstName
                              ? "is-invalid"
                              : ""
                          }`}
                          onChange={(e) => {
                            handleChange(e);
                            handleFieldChange();
                          }}
                        />
                        {errorMessage.firstName && (
                          <div className="alert alert-danger custom-error">
                            {errorMessage.firstName}
                          </div>
                        )}
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <Field
                          type="text"
                          id="lastName"
                          name="lastName"
                          placeholder="Enter your last name"
                          className={`mb-2 form-control ${
                            touched.lastName && errors.lastName
                              ? "is-invalid"
                              : ""
                          }`}
                          onChange={(e) => {
                            handleChange(e);
                            handleFieldChange();
                          }}
                        />
                        {errorMessage.lastName && (
                          <div className="alert alert-danger custom-error">
                            {errorMessage.lastName}
                          </div>
                        )}
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          className={`mb-2 form-control ${
                            touched.email && errors.email ? "is-invalid" : ""
                          }`}
                          onChange={(e) => {
                            handleChange(e);
                            handleFieldChange();
                          }}
                        />
                        {errorMessage.email && (
                          <div className="alert alert-danger custom-error">
                            {errorMessage.email}
                          </div>
                        )}
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <Field
                          type="date"
                          id="dob"
                          name="dob"
                          placeholder="Select your date of birth"
                          className={`mb-2 form-control ${
                            touched.dob && errors.dob ? "is-invalid" : ""
                          }`}
                          onChange={(e) => {
                            handleChange(e);
                            handleFieldChange();
                          }}
                        />
                        <ErrorMessage
                          name="dob"
                          component="div"
                          className="invalid-feedback"
                        />
                        {errorMessage.dob && (
                          <div className="alert alert-danger custom-error">
                            {errorMessage.dob}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <Field
                          type="password"
                          id="password"
                          name="password"
                          placeholder="Enter your password"
                          className={`mb-2 form-control ${
                            touched.password && errors.password
                              ? "is-invalid"
                              : ""
                          }`}
                          onChange={(e) => {
                            handleChange(e);
                            handleFieldChange();
                          }}
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="invalid-feedback"
                        />
                        {errorMessage.password && (
                          <div className="alert alert-danger custom-error">
                            {errorMessage.password}
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        <Field
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Confirm your password"
                          className={`mb-2 form-control ${
                            touched.confirmPassword && errors.confirmPassword
                              ? "is-invalid"
                              : ""
                          }`}
                          onChange={(e) => {
                            handleChange(e);
                            handleFieldChange();
                          }}
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="invalid-feedback"
                        />
                        {errorMessage.confirmPassword && (
                          <div className="alert alert-danger custom-error">
                            {errorMessage.confirmPassword}
                          </div>
                        )}
                      </div>
                      <div>
                        {errorMessage.error && (
                          <div className="alert alert-danger">
                            {errorMessage.error}
                          </div>
                        )}
                        <Button
                          type="submit"
                          className="mt-2"
                          onClick={handleSubmit}
                        >
                          Register
                        </Button>
                      </div>
                    </Form>
                  </Container>
                </Col>
              </Row>
            </Fragment>
          );
        }}
      </Formik>
    </Fragment>
  );
};

export default Register;
