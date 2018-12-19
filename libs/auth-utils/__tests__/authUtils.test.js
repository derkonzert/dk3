"use strict";

const authUtils = require("..");

describe("auth-utils", () => {
  it("doesnt throw", () => {
    expect(authUtils).not.toThrowError();
  });
});
