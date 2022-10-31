const chai = require("chai");
const chaiHttp = require("chai-http");
const { response } = require("express");
const server = require("../index.js");

chai.should();

chai.use(chaiHttp);

describe("Books API", () => {
  describe("GET /books", () => {
    it("Get all books", (done) => {
      chai
        .request(server)
        .get("/books")
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a("array");
          done();
        });
    });
  });
});
