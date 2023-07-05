import React from "react";
import { CDBIcon, CDBBtn, CDBBox } from "cdbreact";
import logo from "../assets/img/register_main.jpg";

const Footer = () => {
  return (
    <footer className="shadow py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 mb-4">
            <a href="/" className="d-flex align-items-center p-0 text-dark">
              <img alt="logo" src={logo} width="30px" />
              <span className="ms-3 h5 font-weight-bold">Shopping Cart</span>
            </a>
            <p className="my-3" style={{ width: "250px" }}>
              We are creating a platform to buy and sell products
            </p>
          </div>
          <div className="col-lg-3 mb-4">
            <h5 className="mb-4 font-weight-bold">Shopping Cart</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/">Resources</a>
              </li>
              <li>
                <a href="/">About Us</a>
              </li>
              <li>
                <a href="/">Contact</a>
              </li>
              <li>
                <a href="/">Blog</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 mb-4">
            <h5 className="mb-4 font-weight-bold">Help</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/">Support</a>
              </li>
              <li>
                <a href="/">Sign Up</a>
              </li>
              <li>
                <a href="/">Sign In</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 mb-4">
            <h5 className="mb-4 font-weight-bold">Products</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/">Windframe</a>
              </li>
              <li>
                <a href="/">Loop</a>
              </li>
              <li>
                <a href="/">Contrast</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 text-center">
            <CDBBox display="flex" justifyContent="center" className="mt-4">
              <CDBBtn flat color="dark" className="p-2">
                <CDBIcon fab icon="facebook-f" />
              </CDBBtn>
              <CDBBtn flat color="dark" className="mx-3 p-2">
                <CDBIcon fab icon="twitter" />
              </CDBBtn>
              <CDBBtn flat color="dark" className="p-2">
                <CDBIcon fab icon="instagram" />
              </CDBBtn>
            </CDBBox>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 text-center">
            <small className="text-center mt-5">
              &copy; Shopping Cart, 2023. All rights reserved.
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
