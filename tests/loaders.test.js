const scriptLoader = require("../lib/script-loader");
const styleLoader = require("../lib/style-loader");

const SRC = `
import React from 'react';
import rx from 'resplendence';

rx\`
body {
  padding: 0;
  /* a comment inside a style */
}
\`;

const hello = "test";

const HELLO = rx()\`
  background-color: pink;
\`;

const Hello = rx("div")\`
  background-color: pink;
\`;

export const Component = ({children}) => {
  throw new Error("Test");
};
`;

const SRC_NO_COMPONENTS = `import rx from 'resplendence';
import React from 'react';

rx\`
body {
  padding: 0;
}
\`;

const HELLO = rx()\`
  background-color: pink;
\`;

export const Hello = ({children}) => {
  return <div className={HELLO}>{children}</div>;
};
`;

const SCRIPT_OUTPUT = `
import React from 'react';
import "/src/test?resplendence=true";import rx from 'resplendence';

/*
body {
  padding: 0;
  ~* a comment inside a style *~
}
*/;

const hello = "test";

const HELLO = "rx-test-1"/*
  background-color: pink;
*/;

const Hello = rx("div", "rx-test-2")/*
  background-color: pink;
*/;

export const Component = ({children}) => {
  throw new Error("Test");
};
`;

const SCRIPT_OUTPUT_NO_COMPONENTS = `import "/src/test?resplendence=true";
import React from 'react';

/*
body {
  padding: 0;
}
*/;

const HELLO = "rx-test-1"/*
  background-color: pink;
*/;

export const Hello = ({children}) => {
  return <div className={HELLO}>{children}</div>;
};
`;

/**
 * @param {function (string): void} loader
 * @param {string} expected
 * @returns {function (string): void}
 */
function bindLoader(loader, expected) {
  return loader.bind({
    query: { src: "/src" },
    resourcePath: "/src/test",
    callback: (_error, output, map) => {
      expect(output).toEqual(expected);
    },
    sourceMap: true,
    resourceQuery: "resplendence=true"
  });
}

describe("scriptLoader", () => {
  test("works as expected", () => {
    bindLoader(scriptLoader, SCRIPT_OUTPUT)(SRC);
  });

  test("strips out import when no components are generated", () => {
    bindLoader(scriptLoader, SCRIPT_OUTPUT_NO_COMPONENTS)(SRC_NO_COMPONENTS);
  });
});

const STYLE_OUTPUT = `




body {
  padding: 0;
  /* a comment inside a style */
}




.rx-test-1 {
  background-color: pink;
}

.rx-test-2 {
  background-color: pink;
}`;

describe("styleLoader", () => {
  bindLoader(styleLoader, STYLE_OUTPUT)(SRC);
});
