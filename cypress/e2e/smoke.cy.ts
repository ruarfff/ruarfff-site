describe("smoke tests", () => {
  it("should load", () => {
    cy.visitAndCheck("/");
  });
});
