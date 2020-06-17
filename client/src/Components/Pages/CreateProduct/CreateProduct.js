import React, { useState } from "react";
import "./CreateProduct.scss";
const classNames = require("classnames");
const CreateFlower = (props) => {
  const [formData, setFormData] = useState({ name: "", description: "" });

  return (
    <div className={classNames("card")}>
      <div className={classNames("card-title")}>
        <h2> Create Flower</h2>
      </div>

      <div className={classNames("card-content")}>
        <div className={classNames("input-wrapper")}>
          <div className={classNames("input-label")}>Name</div>
          <div className={classNames("input-content")}>
            <input type="text" />
          </div>
        </div>

        <div className={classNames("input-wrapper")}>
          <div className={classNames("input-label")}>Description</div>
          <div className={classNames("input-content")}>
            <textarea />
          </div>
        </div>
      </div>
      <div className={classNames("card-actions")}>
        <div className={classNames("spacer")} />
        <button>Cancel</button>
        <button>Save</button>
      </div>
    </div>
  );
};

export default CreateFlower;
