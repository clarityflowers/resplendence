const scriptLoader = require("../lib/script-loader");
const styleLoader = require("../lib/style-loader");
const { SourceMapConsumer } = require("source-map");

const SRC = `
import React from 'react';
import rx from 'resplendence';

rx\`
body {
  padding: 0;
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
import rx from 'resplendence';
import "/src/test?resplendence=true";

const hello = "test";

const HELLO = "rx-test-1";

const Hello = rx("div", "rx-test-2");

export const Component = ({children}) => {
  throw new Error("Test");
};
`;

const SCRIPT_OUTPUT_NO_COMPONENTS = `import "/src/test?resplendence=true";
import React from 'react';

const HELLO = "rx-test-1";

export const Hello = ({children}) => {
  return <div className={HELLO}>{children}</div>;
};
`;

/**
 * @param {function (string): void} loader
 * @param {string} expected
 * @param {(function (import("source-map").RawSourceMap): void)=} testSourceMap
 * @returns {function (string): void}
 */
function bindLoader(loader, expected, testSourceMap) {
  return loader.bind({
    query: { src: "/src" },
    resourcePath: "/src/test",
    callback: (_error, output, map) => {
      expect(output).toEqual(expected);
      if (testSourceMap) testSourceMap(map);
    },
    sourceMap: true,
    resourceQuery: "resplendence=true"
  });
}

describe("scriptLoader", () => {
  test("works as expected", done => {
    bindLoader(scriptLoader, SCRIPT_OUTPUT, async map => {
      const consumer = await new SourceMapConsumer(map);
      const source = "/src/test";
      expect(consumer.originalPositionFor({ line: 1, column: 0 })).toEqual({
        line: 1,
        column: 0,
        source,
        name: null
      });
      expect(consumer.originalPositionFor({ line: 4, column: 0 })).toEqual({
        line: null,
        column: null,
        source: null,
        name: null
      });
      expect(consumer.originalPositionFor({ line: 5, column: 0 })).toEqual({
        line: 4,
        column: 0,
        source,
        name: null
      });
      expect(consumer.originalPositionFor({ line: 6, column: 0 })).toEqual({
        line: 11,
        column: 0,
        source,
        name: null
      });
      expect(consumer.originalPositionFor({ line: 8, column: 0 })).toEqual({
        line: 13,
        column: 0,
        source,
        name: null
      });
      expect(consumer.originalPositionFor({ line: 8, column: 6 })).toEqual({
        line: 13,
        column: 6,
        source,
        name: null
      });
      expect(consumer.originalPositionFor({ line: 13, column: 12 })).toEqual({
        line: 22,
        column: 12,
        source,
        name: null
      });
      done();
    })(SRC);
  });

  test("strips out import when no components are generated", () => {
    bindLoader(scriptLoader, SCRIPT_OUTPUT_NO_COMPONENTS)(SRC_NO_COMPONENTS);
  });
});

const STYLE_OUTPUT = `
body {
  padding: 0;
}

.rx-test-1 {
  background-color: pink;
}
.rx-test-2 {
  background-color: pink;
}
`;

describe("styleLoader", () => {
  bindLoader(styleLoader, STYLE_OUTPUT)(SRC);
});
