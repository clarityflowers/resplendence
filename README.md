# Resplendence [![npm](https://img.shields.io/npm/v/resplendence.svg)](https://www.npmjs.com/package/resplendence)

Styling in React made easy, beautiful, and performant.

```bash
npm install --save resplendence
```

Following in the footsteps of [Styled Components](https://github.com/styled-components/styled-components) and [Glamorous](https://github.com/paypal/glamorous), Resplendence lets you use raw css to style your React components, right in the .js file.

```jsx
import React from "react";
import rx from "resplendence";

// Put raw css in your javascript...
rx`
html {
  background: linear-gradient(to right, #ff9966, #ff5e62);
}
`;

// ... or let it generate a classname for you...
const APP_CLASSNAME = rx()`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

// ... or use styled components.
const StyledComponentTitle = rx("h1")`
  color: white;
  font-size: 150px;
  font-family: sans-serif;
`;

const App = () => (
  <div className={APP_CLASSNAME}>
    <StyledComponentTitle>Hello =)</StyledComponentTitle>
  </div>
);

export default App;
```

During the webpack bundle, Resplendence will auto-generate separate css files and give you back your choice of a css class or a styled component. It all happens during the build, meaning you get the benefits of css-in-js with none of the overhead during runtime.

Here's the js and css files that will get emitted to your bundle:

```jsx
import React from "react";
import rx from "resplendence";

const APP_CLASSNAME = "rx-App-1";

const StyledComponentTitle = rx("h1", "rx-App-2");

const App = () => (
  <div className={APP_CLASSNAME}>
    <StyledComponentTitle>Hello =)</StyledComponentTitle>
  </div>
);

export default App;
```

```css
html {
  background: linear-gradient(to right, #ff9966, #ff5e62);
}

.rx-App-1 {
  background: linear-gradient(to right, #ff9966, #ff5e62);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.rx-App-2 {
  color: white;
  font-size: 200px;
  font-family: sans-serif;
}
```

## Setup

In your `webpack.config`, you'll need to configure two loaders.

The `script-loader` should be added to run on your script files before your other js loaders (last in the list).

The `style-loader` must be set up to match on `resourceQuery: /resplendence=true/`. Use `oneOf` to make sure that it is caught separately from your other rules, and add in all of your css loaders afterwards.

Here's an example of what an ejected `create-react-app` application looks like with this set up:

```js
// webpack.config

module.exports = {
  // ...,
  module: {
    // ...,
    rules: [
      // ...,
      {
        oneOf: [
          // ...,
          {
            resourceQuery: /resplendence=true/,
            use: [
              ...getStyleLoaders({
                importLoaders: 1
              }),
              {
                loader: require.resolve("resplendence/style-loader"),
                options: {
                  src: paths.appSrc
                }
              }
            ]
          }
          {
            test: /\.(js|jsx)$/,
            use: [
              // ...,
              {
                loader: require.resolve("resplendence/script-loader"),
                options: {
                  src: paths.appSrc
                }
              }
            ],
            include: "./src"
          }
          // ...
        ]
        // ...
      }
    ],
    // ...
  },
};
```

At this point, you should be good to go!

## Preprocessors

Want to use SCSS or LESS? Just make sure to throw in the appropriate loaders in your `/resplendence=true/` rules.

SCSS lets you use patterns like the following:

```jsx
import cx from "classnames";

rx`
$gradient: linear-gradient(to right, #ff9966, #ff5e62);
$font-size: 150px;
`;

const CLASSNAME = rx()`
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  &.colorful {
    background: $gradient;
  }
  .title {
    color: white;
    font-size: $font-size;
    font-family: sans-serif;
  }
`;

const App = ({ colorful }) => (
  <div className={cx(CLASSNAME, { colorful })}>
    <h1 className="title">Hello =)</h1>
  </div>
);
```

## Refs

If you need the ref to a resplendent component, pass the `innerRef` prop. This will turn into a `ref` prop if you're styling a raw html component, and otherwise pass through as `innerRef` for everything else. This means that refs work with nested resplendent components, as well as any other React components that ask for an `innerRef`.

## Classnames

Assuming your css preprocessor supports it, using classes can be a powerful tool for having resplendent components handle multiple states. To this end, you can pass the `rx` property to any resplendent component, which will be used to set the className according to the rules of [classnames](https://github.com/JedWatson/classnames).

```jsx
const Component = rx("div")`
  background: black;
  &.active {
    background: red;
  }
`;

const App = ({ on, charged }) => <Component rx={{ active: on && charged }} />;
```
