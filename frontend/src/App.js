import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { loadedUser } from "./actions/UserActions";
import "./App.css";
import Cart from "./components/cart/Cart";
import Home from "./components/Home";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ProductDetails from "./components/product/ProductDetails";
import PrivateRoute from "./components/route/PrivateRoute";
import ForgotPassword from "./components/user/ForgotPassword";
import Login from "./components/user/Login";
import Profile from "./components/user/Profile";
import Register from "./components/user/Register";
import ResetPassword from "./components/user/ResetPassword";
import UpdatePassword from "./components/user/UpdatePassword";
import UpdateProfile from "./components/user/UpdateProfile";
import Shipping from "./components/cart/Shipping";
import store from "./Store";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import axios from "axios";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "./components/cart/Payment";
import OrderSuccess from "./components/cart/OrderSuccess";
import ListOfOrders from "./components/order/ListOfOrders";
import OrderDetails from "./components/order/OrderDetails";
import Dashboard from "./components/admin/Dashboard";
import Products from "./components/admin/Products";
import NewProduct from "./components/admin/NewProduct";
import { useSelector } from "react-redux";
import UpdateProduct from "./components/admin/UpdateProduct";
import Orders from "./components/admin/Orders";
import ProcessOrder from "./components/admin/ProcessOrder";
import Users from "./components/admin/Users";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";

export default function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");
  const { user, isAuthenticated, loading } = useSelector(state => state.user)
  useEffect(() => {
    store.dispatch(loadedUser());
    async function getStripeApiKey() {
      const { data } = await axios.get("/api/v1/stripeapi");
      setStripeApiKey(data.stripeApiKey);
    }

    getStripeApiKey();
  }, []);
  return (
    <Router>
      <div>
        <Header />
        <div className="container container-fluid">
          <Route path="/" exact component={Home} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/cart" exact component={Cart} />
          <Route path="/me/update" exact component={UpdateProfile} />
          <Route path="/password/update" exact component={UpdatePassword} />
          <Route path="/password/forgot" exact component={ForgotPassword} />
          <Route
            path="/password/reset/:token"
            exact
            component={ResetPassword}
          />
          <Route path="/search/:keyword" component={Home} />
          <Route path="/product/:id" exact component={ProductDetails} />

          {stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <Route path="/payment" component={Payment} />
            </Elements>
          )}

          <Route path="/shipping" exact component={Shipping} />
          <Route path="/confirm" exact component={ConfirmOrder} />
          <Route path="/orders/me" exact component={ListOfOrders} />
          <PrivateRoute path="/order/:id" exact component={OrderDetails} />
          <PrivateRoute path="/me" exact component={Profile} />
          <PrivateRoute path="/success" exact component={OrderSuccess} />
          
        </div>

        <PrivateRoute path="/dashboard" isAdmin={true} exact component={Dashboard} />
        <PrivateRoute path="/admin/products" isAdmin={true} exact component={Products} />
        <PrivateRoute path="/admin/orders" isAdmin={true} exact component={Orders} />
        <PrivateRoute path="/admin/users" isAdmin={true} exact component={Users} />
        <PrivateRoute path="/admin/reviews" isAdmin={true} exact component={ProductReviews} />
        <PrivateRoute path="/admin/order/:id" isAdmin={true} exact component={ProcessOrder} />
        <PrivateRoute path="/admin/user/:id" isAdmin={true} exact component={UpdateUser} />
        <PrivateRoute path="/admin/product/new" isAdmin={true} exact component={NewProduct} />
        <PrivateRoute path="/admin/product/:id" isAdmin={true} exact component={UpdateProduct} />
        {!loading && (!isAuthenticated || user.role !== 'admin') && (
          <Footer />
        )}
      </div>
    </Router>
  );
}
