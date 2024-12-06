const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  // Create an issue with every field: POST request to /api/issues/{project}
  test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/test")
      .send({
        issue_title: "Test issue",
        issue_text: "This is a test issue",
        created_by: "Functional Test - Every field",
        assigned_to: "Jasmine",
        status_text: "In QA",
      })
      .end(function (err, res) {
        assert.equal(res.body.issue_title, "Test issue");
        assert.equal(res.body.issue_text, "This is a test issue");
        assert.equal(res.body.created_by, "Functional Test - Every field");
        assert.equal(res.body.assigned_to, "Jasmine");
        assert.equal(res.body.status_text, "In QA");
        assert.isTrue(res.body.open, "Issue should be open");
        assert.isNotNull(res.body._id);
        done();
      });
  });

  // Create an issue with only required fields: POST request to /api/issues/{project}
  test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/test")
      .send({
        issue_title: "Test issue",
        issue_text: "This is a test issue",
        created_by: "Functional Test - Required fields",
      })
      .end(function (err, res) {
        assert.equal(res.body.issue_title, "Test issue");
        assert.equal(res.body.issue_text, "This is a test issue");
        assert.equal(res.body.created_by, "Functional Test - Required fields");
        assert.isTrue(res.body.open, "Issue should be open");
        assert.isNotNull(res.body._id);
        done();
      });
  });

  // Create an issue with missing required fields: POST request to /api/issues/{project}

  test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/test")
      .send({
        issue_title: "Test issue",
        issue_text: "This is a test issue",
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });

  // View issues on a project: GET request to /api/issues/{project}

  test("View issues on a project: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/test")
      .end(function (err, res) {
        assert.isArray(res.body);
        done();
      });
  });

  // View issues on a project with one filter: GET request to /api/issues/{project}.

  test("View issues on a project with one filter: GET request to /api/issues/{project}.", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/test?open=true")
      .end(function (err, res) {
        assert.isArray(res.body);
        done();
      });
  });

  // View issues on a project with multiple filters: GET request to /api/issues/{project}

  test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .get("/api/issues/test?open=false&assigned_to=Jasmine")
      .end(function (err, res) {
        assert.isArray(res.body);
        done();
      });
  });

  // Update one field on an issue: PUT request to /api/issues/{project}

  test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/test")
      .send({
        issue_title: "Título de prueba",
        issue_text: "Texto de prueba",
        created_by: "waldo",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        // verificar que res.body._id existe
        assert.isNotNull(res.body._id, "El campo _id no debe ser nulo");
        chai
          .request(server)
          .keepOpen()
          .put("/api/issues/test")
          .send({
            _id: res.body._id,
            open: false,
          })
          .end(function (err, res) {
            assert.equal(res.body.result, "successfully updated");
            done();
          });
      });
  });

  // Update multiple fields on an issue: PUT request to /api/issues/{project}
  test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
    // crear un nuevo issue
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/test")
      .send({
        issue_title: "Título de prueba",
        issue_text: "Texto de prueba",
        created_by: "waldo",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        // verificar que res.body._id existe
        assert.isNotNull(res.body._id, "El campo _id no debe ser nulo");

        chai
          .request(server)
          .keepOpen()
          .put("/api/issues/test")
          .send({
            _id: res.body._id,
            open: false,
            assigned_to: "Jasmine",
          })
          .end(function (err, res) {
            assert.equal(res.body.result, "successfully updated");
            done();
          });
      });
  });
  // Update an issue with missing _id: PUT request to /api/issues/{project}

  test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/test")
      .send({
        _id: undefined,
        open: false,
        assigned_to: "Jasmine",
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });

  // Update an issue with no fields to update: PUT request to /api/issues/{project}

  test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/test")
      .send({
        _id: "111111111111111111111111",
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "no update field(s) sent");
        done();
      });
  });

  // Update an issue with an invalid _id: PUT request to /api/issues/{project}

  test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .put("/api/issues/test")
      .send({
        _id: "5d",
        open: false,
        assigned_to: "Jasmine",
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "could not update");
        done();
      });
  });

  // Delete an issue: DELETE request to /api/issues/{project}

  test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
    // crear un nuevo issue
    chai
      .request(server)
      .keepOpen()
      .post("/api/issues/test")
      .send({
        issue_title: "Título de prueba",
        issue_text: "Texto de prueba",
        created_by: "waldo",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        // verificar que res.body._id existe
        assert.isNotNull(res.body._id, "El campo _id no debe ser nulo");
        chai
          .request(server)
          .keepOpen()
          .delete("/api/issues/test")
          .send({
            _id: res.body._id,
          })
          .end(function (err, res) {
            assert.equal(res.body.result, "successfully deleted");
            done();
          });
      });
  });

  // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}

  test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/test")
      .send({
        _id: "5d",
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "could not delete");
        done();
      });
  });

  // Delete an issue with missing _id: DELETE request to /api/issues/{project}

  test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/test")
      .send({
        _id: undefined,
      })
      .end(function (err, res) {
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});
