import React from "react";
import "./App.scss";
import { AnimatePresence } from "framer-motion";
import CreateProduct from "../Components/Pages/CreateProduct";
import ViewProduct from "../Components/Pages/ViewProduct";
import ListProducts from "../Components/Pages/ListProducts";
import Home from "../Components/Pages/Home/";
import SideBar from "../Components/SideBar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Route
        render={({ location }) => (
          <Switch location={location} key={location.pathname}>
            <Route exact path="/" component={Home} />
            <Route exact path="/home/" component={Home} />
          </Switch>
        )}
      />
    </Router>
  );
}
/**
<AnimatePresence exitBeforeEnter initial={false}>
</AnimatePresence>
 */
export default App;
