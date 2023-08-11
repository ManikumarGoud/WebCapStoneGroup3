import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useFirestore } from "reactfire";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/AuthSlice";

export default function PersonalProfile() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [profilePicture, setProfilePicture] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const firestore = useFirestore();

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

    getUserProfile();
  }, []);

  const getUserProfile = () => {
    axiosInstance
      .get("/user")
      .then((resp) => {
        if (resp.data) {
          const dateObject = new Date(resp.data.dob);

          const year = dateObject.getUTCFullYear();
          const month = String(dateObject.getUTCMonth() + 1).padStart(2, "0");
          const day = String(dateObject.getUTCDate()).padStart(2, "0");

          const formattedDate = `${year}-${month}-${day}`;

          setUser(resp.data);
          formik.setValues({
            firstName: resp.data.firstName,
            lastName: resp.data.lastName,
            addressLine1: resp.data.addressLine1 || "",
            addressLine2: resp.data.addressLine2 || "",
            city: resp.data.city || "",
            dob: formattedDate || "",
            province: resp.data.province || "",
            country: resp.data.country || "",
            phoneNumber: resp.data.phoneNumber || "",
          });
          setProfilePicture(resp.data.profilePicture); // Assuming the backend returns the profile picture URL
        }
      })
      .catch((err) => {});
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      addressLine1: "",
      addressLine2: "",
      dob: "",
      city: "",
      province: "",
      country: "",
      phoneNumber: "",
      image: null,
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string()
        .required("First Name is required")
        .matches(/^[A-Za-z ]+$/, "First Name should contain only alphabets"),
      lastName: Yup.string()
        .required("Last Name is required")
        .matches(/^[A-Za-z ]+$/, "Last Name should contain only alphabets"),
      addressLine1: Yup.string()
        .required("Address Line 1 is required")
        .matches(
          /^[\w\s/-]+$/,
          "Address Line 1 should contain only alphanumeric characters, hyphen, space, and forward slash"
        )
        .min(3, "Address Line 1 should be at least 3 characters")
        .max(50, "Address Line 1 should not exceed 50 characters"),
      addressLine2: Yup.string()
        .nullable()
        .matches(
          /^[\w\s/-]+$/,
          "Address Line 2 should contain only alphanumeric characters, hyphen, space, and forward slash"
        )
        .min(3, "Address Line 2 should be at least 3 characters")
        .max(50, "Address Line 2 should not exceed 50 characters"),
      city: Yup.string()
        .required("City is required")
        .matches(/^[A-Za-z]+$/, "City should contain only alphabets")
        .min(3, "City should be at least 3 characters")
        .max(50, "City should not exceed 50 characters"),
      province: Yup.string()
        .required("Province is required")
        .matches(/^[A-Za-z]+$/, "Province should contain only alphabets")
        .min(3, "Province should be at least 3 characters")
        .max(50, "Province should not exceed 50 characters"),
      country: Yup.string()
        .required("Country is required")
        .matches(/^[A-Za-z]+$/, "Country should contain only alphabets")
        .min(3, "Country should be at least 3 characters")
        .max(50, "Country should not exceed 50 characters"),
      phoneNumber: Yup.string()
        .required("Phone Number is required")
        .matches(
          /^[1-9]\d{2}-\d{3}-\d{4}$/,
          "Invalid Phone Number format. Should be XXX-XXX-XXXX"
        ),
      dob: Yup.date()
        .required("DoB is required")
        .max(new Date(), "Invalid date of birth")
        .min(new Date(1900, 0, 1), "Invalid date of birth"),
      image: profilePicture
        ? Yup.mixed()
        : Yup.mixed().test(
            "fileType",
            "Only JPEG, JPG, and PNG files are allowed",
            (value) => {
              if (!value) return false;
              const acceptedFormats = ["image/jpeg", "image/jpg", "image/png"];
              return acceptedFormats.includes(value.type);
            }
          ),
    }),
  });

  const updateFirebaseProfile = async (values) => {
    const { firstName, lastName } = values;
    try {
      const usersCollectionRef = collection(firestore, "users");
      const querySnapshot = await getDocs(
        query(usersCollectionRef, where("email", "==", user.email))
      );
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(firestore, "users", userDoc.id);
        await updateDoc(userRef, { firstName, lastName });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (!formik.isValid) {
        return;
      }
      setIsLoading(true);
      // Save form data or perform other actions here
      const userUpdatedValues = {
        firstName: values.firstName,
        lastName: values.lastName,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        dob: values.dob,
        country: values.country,
        province: values.province,
        phoneNumber: values.phoneNumber,
        profilePicture: profilePicture,
      };

      axiosInstance
        .post("/user/update", userUpdatedValues)
        .then((resp) => {
          if (typeof resp.data !== "boolean") {
            setErrorMessage((prevErrors) => ({
              ...prevErrors,
            }));
          } else {
            toast.success("Update Successful!!");
            setIsEditMode(false);
            getUserProfile();
            updateFirebaseProfile(formik.values);
          }
        })
        .catch((error) => {
          setErrorMessage((prevErrors) => ({
            ...prevErrors,
            ...error.response.data,
          }));
          toast.error("User Profile updated failed!!");
        })
        .finally(() => {
          setIsLoading(false); // Hide the spinner after the post method call is completed
        });
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    getUserProfile();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
                    src={profilePicture}
                    alt="Avatar"
                    className="mt-5 mb-2 rounded-circle"
                    style={{ width: "80px" }}
                    fluid
                  />
                  <MDBTypography tag="h5" className="text-white">
                    {user.firstName} {user.lastName}
                  </MDBTypography>
                  {isEditMode ? (
                    <MDBIcon
                      far
                      icon="save mb-5"
                      onClick={handleSubmit.bind(this, formik.values)}
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
                          {formik.errors.firstName || errorMessage.firstName}
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
                          {formik.errors.lastName || errorMessage.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="dob">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          placeholder="Enter DoB"
                          name="dob"
                          value={formik.values.dob}
                          onChange={formik.handleChange}
                          isInvalid={formik.touched.dob && formik.errors.dob}
                          disabled={!isEditMode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.dob || errorMessage.dob}
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
                          {formik.errors.addressLine1 ||
                            errorMessage.addressLine1}
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
                          {formik.errors.addressLine2 ||
                            errorMessage.addressLine2}
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
                          {formik.errors.city || errorMessage.city}
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
                          {formik.errors.province || errorMessage.province}
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
                          {formik.errors.country || errorMessage.country}
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
                          {formik.errors.phoneNumber ||
                            errorMessage.phoneNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                      {isEditMode && (
                        <>
                          <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control
                              type="file"
                              name="image"
                              onChange={handleImageChange}
                            />
                            {formik.touched.image && formik.errors.image && (
                              <div className="text-danger">
                                {formik.errors.image ||
                                  errorMessage.profilePicture}
                              </div>
                            )}
                          </Form.Group>
                          {errorMessage.error && (
                            <div className="alert alert-danger">
                              {errorMessage.error}
                            </div>
                          )}
                          <Button variant="secondary" onClick={handleCancel}>
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            type="submit"
                            className="ms-2"
                            id="hiddenSubmitButton"
                            onClick={handleSubmit.bind(this, formik.values)}
                            disabled={isLoading} // Disable the "Save" button during loading
                          >
                            {isLoading ? (
                              <span>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Saving...
                              </span>
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </>
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
