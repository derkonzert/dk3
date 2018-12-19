"use strict";

const auth = require("..");

describe("auth", () => {
  it("doesnt throw", () => {
    expect(auth).not.toThrow();
  });
});
