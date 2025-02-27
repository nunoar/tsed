import "@tsed/platform-express";
import "../../src/index.js";

import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/platform-http";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";

const rootDir = import.meta.dirname; // automatically replaced by import.meta.dirname on build

@Configuration({
  rootDir,
  port: 8001,
  disableComponentScan: true,
  scalar: [
    {
      path: "/doc",
      specVersion: "3.0.1"
    }
  ]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  public $beforeRoutesInit(): void {
    this.app
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      )
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride());
  }
}
