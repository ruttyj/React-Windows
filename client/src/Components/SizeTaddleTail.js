// Original: https://github.com/chenglou/react-motion/tree/master/demos/demo8-draggable-list

import React from "react";
const isDef = (v) => v !== undefined && v !== null;
const emptyFunc = () => {};

class SizeTaddleTail extends React.Component {
  constructor(props) {
    super(props);
    this.checkSize = this.checkSize.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getStyle = this.getStyle.bind(this);

    this.state = {
      height: 0,
      width: 0,
    };
  }

  componentDidUpdate() {
    this.checkSize();
  }

  componentDidMount() {
    this.checkSize();
  }

  getStyle = function (el, prop) {
    if (typeof getComputedStyle !== "undefined") {
      return getComputedStyle(el, null).getPropertyValue(prop);
    } else {
      return el.currentStyle[prop];
    }
  };

  checkSize() {
    let el = this.refs.inner;
    let height = el.clientHeight;
    let width = el.clientWidth;
    let margin = {
      top: parseFloat(this.getStyle(el, "margin-top")),
      bottom: parseFloat(this.getStyle(el, "margin-bottom")),
      left: parseFloat(this.getStyle(el, "margin-left")),
      right: parseFloat(this.getStyle(el, "margin-right")),
    };
    this.onChange({
      height,
      width,
      total: {
        height: height + margin.top + margin.bottom,
        width: width + margin.left + margin.right,
      },
    });
  }

  onChange(newSize) {
    let callback = isDef(this.props.onChange) ? this.props.onChange : emptyFunc;
    if (
      this.state.height !== newSize.height ||
      this.state.width !== newSize.width
    ) {
      callback(newSize);
      this.setState({
        ...newSize,
      });
    }
  }

  render() {
    let { style } = this.props;

    style = style || {};
    // {this.refs.inner.clientHeight}
    return (
      <div
        style={{ display: "inline-block", ...style }}
        {...this.props}
        ref="inner"
        onClick={this.checkSize}
      >
        {this.props.children}
      </div>
    );
  }
}

export default SizeTaddleTail;
