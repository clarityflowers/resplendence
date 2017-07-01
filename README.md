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

## SCSS, LESS, ect.
You don't have to use CSS. Want to use SCSS? Just configure a different extension:

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

