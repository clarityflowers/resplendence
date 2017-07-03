# Resplendence [![npm](https://img.shields.io/npm/v/resplendence.svg)](https://www.npmjs.com/package/resplendence)

Styling in React made easy, beautiful, and performant.

```bash
npm install --save resplendence
```

Following in the footsteps of [Styled Components](https://github.com/styled-components/styled-components) and [Glamorous](https://github.com/paypal/glamorous), Resplendence lets you use raw css to style your React components, right in the .js file.

```jsx
import React, { Component } from 'react';
import rx from 'resplendence';

const Container = rx('div')`
  background: linear-gradient(to right, #ff9966, #ff5e62);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`
const Title = rx('h1')`
  color: white;
  font-size: 200px;
  font-family: sans-serif;
`

class App extends Component {
  render() {
    return (
      <Container>
        <Title>Hello =)</Title>
      </Container>
    );
  }
}

export default App;
```

During the webpack bundle, Resplendence will auto-generate separate css files, using hashed classNames to link your resplendent components to their styles. It all happens during the build, meaning you get all the benefits of css-in-js with none of the overhead during runtime.

```css
.resplendent--1647984331-0 {
  background: linear-gradient(to right, #ff9966, #ff5e62);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
.resplendent--1647984331-1 {
  color: white;
  font-size: 200px;
  font-family: sans-serif;
}
```

## Setup

In your `webpack.config`, you'll need to configure the Resplendent plugin and loader. Set the `src` option to wherever the source code for your app lives.

```js
// webpack.config

const resplendence = require('resplendence');
const resplendenceConfig = resplendence.config({src: './src'});

module.exports = {
  // ...,
  module: {
    // ...,
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          // ...,
          resplendenceConfig.loader
        ],
        include: './src'
      }
    ]
  },
  plugins: [
    // ...,
    resplendenceConfig.plugin
  ]
}
```

Make sure that resplendence loader is the first to run (the last loader in the `use` list runs first). If you have any linters, it will particularly need to come before those.

At this point, you should be good to go! 

## CSS outside of classes
You can also just use raw css without attaching it to a generated class, like so:

```jsx
import rx from 'resplendence'

rx`
html {
  background: red;
}
`
```

## Preprocessors
Want to use SCSS or LESS? Just configure a different extension:

```js
const resplendenceConfig = resplendence.config({src: './src', ext: '.scss'});
```

If you keep in mind that generated files are all kept at the root level of a `.generated` folder in your configured `src` directory, you can even use imports.

```jsx
rx`
@import "../colors.scss";
$font-size: 200px;
`

const Container = rx('div')`
  background: $gradient; //imported from src/colors.scss
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`
const Title = rx('h1')`
  color: white;
  font-size: $font-size;
  font-family: sans-serif;
`
```

Don't try to import a different auto-generated file, please.

## Precedence and Nested Styles
CSS precedence can be a bit of a nightmare. If you wrap a resplendent component inside another respledent component, you'll want to make sure that the outer component takes precedence. If both components are in the same file, then then components declared lower in the file take precedence, which should be exactly what you want. Otherwise, you can use following syntax to ask for precedence:

```jsx
import OtherResplendentComponent from './some-file.js';

const Component = rx(OtherResplendentComponent)`--1
  // styles go here
`
```

Eventually there will be support for `--2` and `--3` and so on for further levels of precedence, but for now if you really need it, you can use scss mixins and extends to a similar purpose.

## Refs
If you need the ref to a resplendent component, just pass the `innerRef` prop. This will turn into a `ref` prop if you're styling a raw html component, and otherwise pass through as `innerRef` for everything else. This means that refs work just fine with nested resplendent components, and will work nicely with any other React components that ask for an `innerRef`.

## Classnames
Assuming your css preprocessor supports it, using classes can be a powerful tool for having your resplendent components handle multiple states. To this end, you can pass the `rx` property to any component, which will be used to set the className according to the rules of [classnames](https://github.com/JedWatson/classnames).

```
const Component = rx('div')`
  background: black;
  &.active {
    background: red;
  }
`

const App = (props) => {
  const { on, charged } = props;
  return (
    <Component rx={{active: on && charged}}/>
  )
}
```

