import React, { useState } from "react";
import "./ViewProduct.scss";
import products from "../../../Data";
const classNames = require("classnames");

const CreateFlower = (props) => {
  const [formData, setFormData] = useState({ name: "", description: "" });

  return (
    <div className={classNames("card")}>
      <div className={classNames("card-title")}>
        {
          <pre>
            <xmp>{JSON.stringify(props, null, 2)}</xmp>
          </pre>
        }
      </div>
    </div>
  );
};

export default CreateFlower;
