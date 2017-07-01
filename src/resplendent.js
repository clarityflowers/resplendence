import React from 'react';
const e = React.createElement;

const resplendent = (element, styleClass) =>
{
    return (props) => {
        const newProps = Object.assign({}, props);
        newProps.className = props.className + " " + styleClass;
        return e(element, newProps);
    }
}

export default resplendent;