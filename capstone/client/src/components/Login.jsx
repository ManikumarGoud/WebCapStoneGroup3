import React, { Fragment, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button, Row, Col, Container } from "react-bootstrap";
import axiosInstance from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch /*useSelector*/ } from "react-redux";
import { login } from "../store/slice/AuthSlice";

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    axiosInstance
      .post("/login", {})
      .then((resp) => {
        if (typeof resp.data !== "boolean") {
          setErrorMessage(resp.data.error);
        } else {
          dispatch(login());
          navigate("/");
        }
      })
      .catch((error) => {});
  }, []);

  const schema = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={schema}
      onSubmit={(values, { resetForm }) => {
        const { email, password } = values;
        axiosInstance
          .post("/login", {
            email,
            password,
          })
          .then((resp) => {
            if (typeof resp.data !== "boolean") {
              setErrorMessage(resp.data.error);
            } else {
              dispatch(login());
              resetForm();
              navigate("/");
            }
          })
          .catch((error) => {
            console.log(error);
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
            setErrorMessage("");
          }
        };
        return (
          <Fragment>
            <Row className="login">
              <Col
                md={6}
                className="d-flex align-items-center image-container login-img"
              ></Col>
              <Col md={6} className="d-flex flex-column justify-content-center">
                <Container className="p-5">
                  <h2 className="display-6 text-center text-uppercase mt-2">
                    Login
                  </h2>
                  <Form>
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
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="invalid-feedback"
                      />
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
                    </div>
                    <div>
                      {errorMessage.error && (
                        <div className="alert alert-danger custom-error">
                          {errorMessage.error}
                        </div>
                      )}
                      <Button
                        type="submit"
                        className="mt-2"
                        onClick={handleSubmit}
                      >
                        Login
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
  );
};

export default Login;
