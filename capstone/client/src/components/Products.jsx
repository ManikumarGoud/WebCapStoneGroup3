import React, { useState, useEffect, Fragment } from "react";
import { Modal, Button, Form, Spinner, Card } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/AuthSlice";
import { useNavigate } from "react-router-dom";

const AddProductModal = ({
  show,
  handleClose,
  addProduct,
  selectedProduct,
  updateProduct,
}) => {
  console.log(selectedProduct);
  const [image, setImage] = useState(
    selectedProduct && selectedProduct._id ? true : false
  );
  const initialValues = {
    productName: selectedProduct ? selectedProduct.name : "",
    description: selectedProduct ? selectedProduct.desc : "",
    price: selectedProduct ? selectedProduct.price : "",
    quantity: selectedProduct ? selectedProduct.quantity : "",
    image: selectedProduct
      ? `data:image/jpeg;base64,${selectedProduct.image}`
      : "",
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
    image: initialValues.image.includes(";base64")
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
                {console.log(image)}
                {image && (
                  <img
                    key={initialValues.name}
                    height={100}
                    width={100}
                    src={
                      initialValues.image.includes("data:image/jpeg;base64,")
                        ? initialValues.image
                        : `data:image/jpeg;base64,${initialValues.image}`
                    }
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
                {selectedProduct ? "Update" : "Add"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

const ProductList = ({ products, deleteProduct, editProduct }) => {
  return (
    <div className="mt-4">
      <h2>Product List</h2>
      <div className="row row-cols-1 row-cols-md-3">
        {products.length === 0 ? (
          <div className="col text-center">No products present.</div>
        ) : (
          products.map((product) => (
            <div className="col mb-4" key={product._id}>
              <Card>
                <Card.Img
                  variant="top"
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.name}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.desc}</Card.Text>
                  <Button
                    className="error"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </Button>
                  <Button className="mx-1" onClick={() => editProduct(product)}>
                    Edit
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    axiosInstance
      .post("/login", {})
      .then((resp) => {
        if (typeof resp.data !== "boolean") {
          toast.error("Session Expired!!");
        } else {
          dispatch(login());
          navigate("/products");
        }
      })
      .catch((error) => {});
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/myProducts");
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching products:", error);
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const addProduct = async (productData) => {
    try {
      await axiosInstance.post("/products/add", productData);
      fetchProducts();
      toast.success("Product added Successfully");
    } catch (error) {
      toast.error("Error adding product");
    } finally {
      handleCloseModal();
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axiosInstance.delete(`/products/delete/${productId}`);
      fetchProducts();
      toast.success("Product deleted Successfully");
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  const editProduct = (product) => {
    setSelectedProduct(product);
    handleShowModal();
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      await axiosInstance.put(`/products/update/${id}`, updatedProduct);
      fetchProducts();
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end my-2">
        <Button variant="primary" onClick={handleShowModal}>
          Add Product
        </Button>
      </div>
      {isLoading ? (
        <Spinner animation="border" />
      ) : (
        <Fragment>
          <ProductList
            products={products}
            deleteProduct={deleteProduct}
            editProduct={editProduct}
          />
          <AddProductModal
            show={showModal}
            handleClose={handleCloseModal}
            addProduct={addProduct}
            updateProduct={updateProduct}
            selectedProduct={selectedProduct}
          />
        </Fragment>
      )}
    </div>
  );
};

export default Products;
