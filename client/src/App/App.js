import React from "react";
import Home from "../Components/Pages/Home/";
import "./App.scss";
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
