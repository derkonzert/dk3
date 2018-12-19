const db = require("..");

describe("db", () => {
  it("doesnt throw", () => {
    expect(db).not.toThrow();
  });
});
