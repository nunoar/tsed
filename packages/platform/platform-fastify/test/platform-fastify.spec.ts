import {PlatformTestSdk} from "@tsed/platform-test-sdk";

import {PlatformFastify} from "../src/index.js";
import {rootDir, Server} from "./app/Server.js";

const utils = PlatformTestSdk.create({
  rootDir,
  adapter: PlatformFastify,
  server: Server
});

describe("PlatformFastify integration", () => {
  describe("Handlers", () => {
    utils.test("handlers");
  });
  describe("Children controllers", () => {
    utils.test("childrenControllers");
  });
  describe("Inheritance controllers", () => {
    utils.test("inheritanceController");
  });
  describe("Response", () => {
    utils.test("response");
  });
  // untestable with Fastify
  describe.skip("Stream", () => {
    utils.test("stream");
  });
  describe("Middlewares", () => {
    utils.test("middlewares");
  });
  describe("Scope Request", () => {
    utils.test("scopeRequest");
  });
  describe("Headers", () => {
    utils.test("headers");
  });
  describe("AcceptMime", () => {
    utils.test("acceptMime");
  });
  describe("HeaderParams", () => {
    utils.test("headerParams");
  });
  describe("PathParams", () => {
    utils.test("pathParams");
  });
  describe("QueryParams", () => {
    utils.test("queryParams");
  });
  describe("BodyParams", () => {
    utils.test("bodyParams");
  });
  describe("Cookies", () => {
    utils.test("cookies");
  });
  describe("Session", () => {
    utils.test("session");
  });
  describe("Location", () => {
    utils.test("location");
  });
  describe("Redirect", () => {
    utils.test("redirect");
  });
  describe("Errors", () => {
    utils.test("errors");
  });
  describe("ResponseFilters", () => {
    utils.test("responseFilter");
  });
  describe("Routing", () => {
    utils.test("routing");
  });
  describe("Locals", () => {
    utils.test("locals");
  });
  describe("Auth", () => {
    utils.test("auth");
  });
  describe("Module", () => {
    utils.test("module");
  });

  // EXTRA
  describe.skip("Plugin: View", () => {
    utils.test("view");
  });
  describe.skip("Plugin: Statics files", () => {
    utils.test("statics");
  });
  describe.skip("Plugin: Multer", () => {
    utils.test("multer");
  });
  describe.skip("Plugin: DeepQueryParams", () => {
    utils.test("deepQueryParams");
  });
  describe("Plugin: Custom404", () => {
    utils.test("custom404");
  });
});
