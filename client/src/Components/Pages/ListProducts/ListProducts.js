import React, { useState } from "react";
import "./ListProducts.scss";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import RelLayer from "../../Layers/RelLayer";
import AbsLayer from "../../Layers/AbsLayer";
import FillContainer from "../../Containers/FillContainer/FillContainer";
import FillContent from "../../Containers/FillContainer/FillContent";
import FillFooter from "../../Containers/FillContainer/FillFooter";
import Utils from "../../../Utils/";
import products from "../../../Data";
const { isFunc } = Utils;
const classNames = require("classnames");
const CurrencySymbol = () => {
  return <>$</>;
};

const AddToCartButton = (props) => {
  let { onClick } = props;
  onClick = isFunc(onClick) ? onClick : () => {};
  return <button onClick={onClick}>Add To Cart</button>;
};

const RemoveFromCartButton = (props) => {
  let { onClick } = props;
  onClick = isFunc(onClick) ? onClick : () => {};
  return <button onClick={onClick}>Remove from Cart</button>;
};

const Product = (props) => {
  const [isInCart, setIsInCart] = useState(false);

  const { product } = props;
  let linkTo = `/product/${product.id}`;
  return (
    <div className={classNames("product")}>
      <FillContainer>
        <FillContent>
          <RelLayer>
            <div className={classNames("product-image")}>
              <img src={product.image_url} />
            </div>
            <div
              className={classNames(
                "in-cart-indicator",
                isInCart ? "active" : ""
              )}
            >
              In Cart
            </div>
            <AbsLayer className={classNames("product-hover")}>
              {isInCart ? (
                <RemoveFromCartButton onClick={() => setIsInCart(!isInCart)} />
              ) : (
                <AddToCartButton onClick={() => setIsInCart(!isInCart)} />
              )}
            </AbsLayer>
          </RelLayer>
        </FillContent>
        <FillFooter height={75}>
          <Link to={linkTo}>
            <div className={classNames("product-title")}>{product.title}</div>
            <div className={classNames("product-price")}>
              <CurrencySymbol />
              {product.price}
            </div>
          </Link>

          <div className={classNames("product-rating")}>
            <StarRatings
              rating={product.rating}
              numberOfStars={5}
              starDimension={"10"}
              starSpacing={"3"}
            />
          </div>
        </FillFooter>
      </FillContainer>
    </div>
  );
};

const Featured = (props) => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  return (
    <div className={classNames("product-browser")}>
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Featured;
