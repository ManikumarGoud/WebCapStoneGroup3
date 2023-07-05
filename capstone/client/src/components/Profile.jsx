import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function PersonalProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const initialValues = {
    firstName: "Marie",
    lastName: "Horwitz",
    email: "info@example.com",
    addressLine1: "",
    addressLine2: "",
    city: "",
    province: "",
    country: "",
    phoneNumber: "",
    profilePicture:
      "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    addressLine1: Yup.string().required("Address Line 1 is required"),
    city: Yup.string().required("City is required"),
    province: Yup.string().required("Province is required"),
    country: Yup.string().required("Country is required"),
    phoneNumber: Yup.string().required("Phone Number is required"),
    profilePicture: Yup.string()
      .url("Invalid URL")
      .required("Profile Picture is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // Save form data or perform other actions here
      console.log(values);
      setIsEditMode(false);
    },
  });

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  return (
    <section style={{ backgroundColor: "#f4f5f7" }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="6" className="mb-4 mb-lg-0">
            <MDBCard className="mb-3" style={{ borderRadius: ".5rem" }}>
              <MDBRow className="g-0">
                <MDBCol
                  md="4"
                  className="gradient-custom text-center"
                  style={{
                    borderTopLeftRadius: ".5rem",
                    borderBottomLeftRadius: ".5rem",
                    backgroundColor: "#808080",
                  }}
                >
                  <MDBCardImage
                    src={formik.values.profilePicture}
                    alt="Avatar"
                    className="my-5 rounded-circle"
                    style={{ width: "80px" }}
                    fluid
                  />
                  <MDBTypography tag="h5" className="text-white">
                    {formik.values.firstName} {formik.values.lastName}
                  </MDBTypography>
                  <MDBCardText className="text-white">Web Designer</MDBCardText>
                  {isEditMode ? (
                    <MDBIcon
                      far
                      icon="save mb-5"
                      onClick={formik.handleSubmit}
                    />
                  ) : (
                    <MDBIcon
                      className="cursor-pointer"
                      far
                      icon="edit mb-5"
                      onClick={handleEdit}
                    />
                  )}
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody className="p-4">
                    <Form onSubmit={formik.handleSubmit}>
                      <MDBTypography tag="h6">Information</MDBTypography>
                      <hr className="mt-0 mb-4" />

                      <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter First Name"
                          name="firstName"
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.firstName && formik.errors.firstName
                          }
                          disabled={!isEditMode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Last Name"
                          name="lastName"
                          value={formik.values.lastName}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.lastName && formik.errors.lastName
                          }
                          disabled={!isEditMode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter Email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.email && formik.errors.email
                          }
                          disabled={!isEditMode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="addressLine1">
                        <Form.Label>Address Line 1</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Address Line 1"
                          name="addressLine1"
                          value={formik.values.addressLine1}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.addressLine1 &&
                            formik.errors.addressLine1
                          }
                          disabled={!isEditMode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.addressLine1}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="addressLine2">
                        <Form.Label>Address Line 2</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Address Line 2"
                          name="addressLine2"
                          value={formik.values.addressLine2}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.addressLine2 &&
                            formik.errors.addressLine2
                          }
                          disabled={!isEditMode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.addressLine2}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter City"
                          name="city"
                          value={formik.values.city}
                          onChange={formik.handleChange}
                          isInvalid={formik.touched.city && formik.errors.city}
                          disabled={!isEditMode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.city}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="province">
                        <Form.Label>Province</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Province"
                          name="province"
                          value={formik.values.province}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.province && formik.errors.province
                          }
                          disabled={!isEditMode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.province}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="country">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Country"
                          name="country"
                          value={formik.values.country}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.country && formik.errors.country
                          }
                          disabled={!isEditMode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.country}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="phoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Phone Number"
                          name="phoneNumber"
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.phoneNumber &&
                            formik.errors.phoneNumber
                          }
                          disabled={!isEditMode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.phoneNumber}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="profilePicture">
                        <Form.Label>Profile Picture URL</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Profile Picture URL"
                          name="profilePicture"
                          value={formik.values.profilePicture}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.profilePicture &&
                            formik.errors.profilePicture
                          }
                          disabled={!isEditMode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.profilePicture}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {isEditMode ? (
                        <>
                          <Button variant="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            type="submit"
                            className="ms-2"
                          >
                            Save
                          </Button>
                        </>
                      ) : (
                        <div className="d-flex justify-content-start">
                          <a href="#!">
                            <MDBIcon
                              fab
                              icon="facebook me-3"
                              size="lg"
                              style={{ color: "#333" }}
                            />
                          </a>
                          <a href="#!">
                            <MDBIcon
                              fab
                              icon="twitter me-3"
                              size="lg"
                              style={{ color: "#333" }}
                            />
                          </a>
                          <a href="#!">
                            <MDBIcon
                              fab
                              icon="instagram me-3"
                              size="lg"
                              style={{ color: "#333" }}
                            />
                          </a>
                        </div>
                      )}
                    </Form>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
