import React, { useState, useEffect, Fragment } from "react";
import { Button, Spinner, Card } from "react-bootstrap";
import axiosInstance from "../utils/axiosConfig";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/AuthSlice";
import { useNavigate } from "react-router-dom";
import AddProductModal from "./AddProductModal";

const ProductList = ({ products, deleteProduct, editProduct }) => {
  return (
    <div className="mt-4">
      <h2>Product List</h2>
      <div className="row row-cols-1 row-cols-md-4">
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
  const [selectedProduct, setSelectedProduct] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts();
  }, []);

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
    setSelectedProduct({});
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
