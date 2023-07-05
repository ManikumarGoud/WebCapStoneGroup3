import React, { useState } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal, Button, Form } from "react-bootstrap";
import { useEffect } from "react";

const AddProductModal = ({
  show,
  handleClose,
  addProduct,
  selectedProduct,
  updateProduct,
}) => {
  const [image, setImage] = useState(false);

  useEffect(() => {
    setImage(selectedProduct._id ? true : false);
  }, [selectedProduct]);

  const initialValues = {
    productName: selectedProduct ? selectedProduct.name : "",
    description: selectedProduct ? selectedProduct.desc : "",
    price: selectedProduct ? selectedProduct.price : "",
    quantity: selectedProduct ? selectedProduct.quantity : "",
    image: selectedProduct ? selectedProduct.image : "",
  };
  const validationSchema = Yup.object().shape({
    productName: Yup.string().required("Product Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .min(1, "Price should be greater than 1 CAD")
      .max(999999999, "Price should be less than 999999999 CAD"),
    quantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Quantity should be greater than 1")
      .max(999999999, "Quantity should be less than 999999999"),
    image: image
      ? Yup.mixed()
      : Yup.mixed()
          .required("Image is required")
          .test(
            "fileType",
            "Only JPEG, JPG, and PNG files are allowed",
            (value) => {
              if (!value) return false;
              const acceptedFormats = ["image/jpeg", "image/jpg", "image/png"];
              return acceptedFormats.includes(value.type);
            }
          ),
  });

  const handleSubmit = async (values) => {
    let base64Image = values.image;
    if (!image) {
      const reader = new FileReader();
      reader.readAsDataURL(values.image); // Read the image file

      reader.onloadend = () => {
        base64Image = reader.result.split(",")[1]; // Get the base64-encoded image string
        const productData = {
          _id: selectedProduct?._id,
          name: values.productName,
          desc: values.description,
          price: values.price,
          quantity: values.quantity,
          image: base64Image,
        };
        if (productData._id) {
          updateProduct(selectedProduct._id, productData);
        } else addProduct(productData);
      };
    } else {
      const productData = {
        _id: selectedProduct._id,
        name: values.productName,
        desc: values.description,
        price: values.price,
        quantity: values.quantity,
        image: base64Image,
      };
      if (productData._id) {
        updateProduct(selectedProduct._id, productData);
      } else addProduct(productData);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedProduct ? "Edit Product" : "Add Product"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Product Name</Form.Label>
                <Field
                  type="text"
                  name="productName"
                  className={`form-control ${
                    touched.productName && errors.productName
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <ErrorMessage
                  name="productName"
                  component="div"
                  className="invalid-feedback"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Field
                  type="text"
                  name="description"
                  className={`form-control ${
                    touched.description && errors.description
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="invalid-feedback"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Price</Form.Label>
                <Field
                  type="number"
                  name="price"
                  className={`form-control ${
                    touched.price && errors.price ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="invalid-feedback"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Field
                  type="number"
                  name="quantity"
                  className={`form-control ${
                    touched.quantity && errors.quantity ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  name="quantity"
                  component="div"
                  className="invalid-feedback"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="m-0 mt-1">Product Image</Form.Label>
                <br />
                <input
                  type="file"
                  name="image"
                  onChange={(event) => {
                    setImage(false);
                    setFieldValue("image", event.currentTarget.files[0]);
                  }}
                  className={`form-control-file ${
                    touched.image && errors.image ? "is-invalid" : ""
                  }`}
                />
                {image && initialValues.image && (
                  <img
                    key={initialValues.name}
                    height={100}
                    width={100}
                    src={`data:image/jpeg;base64,${initialValues.image}`}
                    alt={initialValues.name}
                  />
                )}
                <ErrorMessage
                  name="image"
                  component="div"
                  className="invalid-feedback"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-2">
                {image ? "Update" : "Add"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;
