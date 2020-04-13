const {
  getRowAndCol,
  getLineLengths,
  copiedSourceMapping
} = require("../lib/util");
const { PerformanceObserver, performance } = require("perf_hooks");

const SRC = `
import React from 'react';

const HELLO = rx()\`
  background-color: blue;
\`;
`.trim();

const SRC_WHITESPACE = `
const HELLO = "string";
 `;

describe("getLineLengths", () => {
  test("works as expected", () => {
    expect(getLineLengths(SRC)).toEqual([27, 1, 20, 26, 2]);
  });
  test("handles whitespace at end", () => {
    expect(getLineLengths(SRC_WHITESPACE)).toEqual([1, 24, 1]);
  });
});

describe("getRowAndCol", () => {
  const lineLengths = getLineLengths(SRC);
  test("works as expected", () => {
    expect(getRowAndCol(lineLengths, 54)).toEqual({ row: 4, col: 6 });
  });
});

const { SourceNode } = require("source-map");

describe("copiedSourceMapping", () => {
  const lineLengths = getLineLengths(SRC);
  it("works as expected", () => {
    const name = "test";
    expect(copiedSourceMapping(lineLengths, name, SRC, 0, 40)).toEqual([
      new SourceNode(1, 0, name, "import "),
      new SourceNode(1, 7, name, "React "),
      new SourceNode(1, 13, name, "from '"),
      new SourceNode(1, 19, name, "react';\n\n"),
      new SourceNode(3, 0, name, "const "),
      new SourceNode(3, 6, name, "HELLO ")
    ]);
  });
  it("has manageable perf", () => {
    const totals = [];
    const obs = new PerformanceObserver(items => {
      totals.push(items.getEntries()[0].duration);
      performance.clearMarks();
    });
    obs.observe({ entryTypes: ["function"] });
    const map = performance.timerify(copiedSourceMapping);

    var i;
    for (i = 0; i < 100000; i++) {
      map(lineLengths, name, SRC, 0);
    }
    const averagePerf =
      totals.reduce((total, i) => total + i, 0) / totals.length;

    expect(averagePerf).toBeLessThan(0.008);
  });
});
