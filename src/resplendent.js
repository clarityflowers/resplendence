import React from 'react';
import cx from 'classnames';
const e = React.createElement;

const resplendent = (element, styleClass) =>
{
    let name = element;
    let isRaw = (typeof element) === "string" 
    if (!isRaw) {
        name = element.name;
    }
    name = `Resplendent(${name})`;
    const result = (props) => {
        const newProps = Object.assign({}, props);
        delete newProps.rx;
        if (isRaw) {
            delete newProps.innerRef;
            newProps.ref = props.innerRef;
        }
        const rxName = cx(props.rx);
        newProps.className = cx(props.className, styleClass, rxName); 
        return e(element, newProps);
    }
    Object.defineProperty(result, "name", {value: name});
    return result;
}

export default resplendent;