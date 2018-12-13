let React;
try {
  React = require("react");
} catch {
  React = null;
}
const cx = require("classnames");

/**
 * A higher-order component that wraps the given html element
 * with the generated classname.
 *
 * @param {string} element the html element to be styled
 * @param {string} styleClass the generated classname of the component
 */
const resplendent = (element, styleClass) => {
  if (!React)
    throw new Error(
      "You must install React in order to use resplendent components."
    );
  const e = React.createElement;
  let name = element;
  let isRaw = typeof element === "string";
  if (!isRaw) {
    name = element.name;
  }
  name = `Resplendent(${name})`;
  const result = props => {
    const newProps = Object.assign({}, props);
    delete newProps.rx;
    if (isRaw) {
      delete newProps.innerRef;
      newProps.ref = props.innerRef;
    }
    const rxName = cx(props.rx);
    newProps.className = cx(props.className, styleClass, rxName);
    return e(element, newProps);
  };
  Object.defineProperty(result, "name", { value: name });
  return result;
};

module.exports = resplendent;
