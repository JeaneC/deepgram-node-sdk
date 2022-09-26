import { assert } from "chai";
import { mockInvalidCredentials, mockKey } from "./mockResults";
import nock from "nock";
import * as https from "../src/httpRequest";

import { Keys } from "../src/keys";

const fakeCredentials = "testKey:testSecret";
const fakeUrl = "fake.url";
const fakeProjectId = "27e92bb2-8edc-4fdf-9a16-b56c78d39c5b";
const fakeKeyId = "ad9c6799-d380-4db7-8c22-92c20a291229";

describe("Key tests", () => {
  let keys: Keys;

  beforeEach(function () {
    keys = new Keys(fakeCredentials, fakeUrl, https._request);
  });

  afterEach(function () {
    nock.cleanAll();
  });

  it("Errors are thrown", function () {
    const expectedError = `DG: ${JSON.stringify(mockInvalidCredentials)}`;
    nock(`https://${fakeUrl}`)
      .get(`/v1/projects/${fakeProjectId}/keys`)
      .reply(200, mockInvalidCredentials);
    keys.list(fakeProjectId).catch((err) => {
      assert.equal(err, expectedError);
    });
  });

  it("Create resolves", async function () {
    nock(`https://${fakeUrl}`)
      .post(`/v1/projects/${fakeProjectId}/keys`)
      .reply(200, mockKey);
    const response = await keys.create(fakeProjectId, "test Comment", [
      "member",
    ]);

    assert.deepEqual(response, mockKey);
  });

  it("Throws an exception if both expirationDate and timeToLive are provided", async function () {
    const expectedError = `Error: Please provide expirationDate or timeToLive or neither. Providing both is not allowed.`;
    nock(`https://${fakeUrl}`)
      .post(`/v1/projects/${fakeProjectId}/keys`)
      .reply(200, mockKey);

    try {
      await keys.create(fakeProjectId, "test Comment", ["member"], {
        expirationDate: new Date(),
        timeToLive: 30,
      });
    } catch (err) {
      assert.equal(err, expectedError);
    }
  });

  it("Does not throw if only timeToLive is provided as an option", async function () {
    nock(`https://${fakeUrl}`)
      .post(`/v1/projects/${fakeProjectId}/keys`)
      .reply(200, mockKey);

    const response = await keys.create(
      fakeProjectId,
      "test Comment",
      ["member"],
      {
        timeToLive: 30,
      }
    );
    assert.deepEqual(response, mockKey);
  });

  it("Does not throw if only expirationDate is provided as an option", async function () {
    nock(`https://${fakeUrl}`)
      .post(`/v1/projects/${fakeProjectId}/keys`)
      .reply(200, mockKey);

    const response = await keys.create(
      fakeProjectId,
      "test Comment",
      ["member"],
      {
        expirationDate: new Date(),
      }
    );

    assert.deepEqual(response, {
      key: "string",
      comment: "string",
      created: "string",
      scopes: ["member"],
      api_key_id: "fake-api-key-id",
    });
  });

  it("Delete resolves", async function () {
    nock(`https://${fakeUrl}`)
      .delete(`/v1/projects/${fakeProjectId}/keys/${fakeKeyId}`)
      .reply(200, { message: "Successfully deleted the API key!" });

    const response = await keys.delete(fakeProjectId, fakeKeyId);
    console.log("response", response);
    assert.deepEqual(response, {
      message: "Successfully deleted the API key!",
    });
  });
});
