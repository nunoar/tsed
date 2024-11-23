import {DITest, inject} from "@tsed/di";
import {PlatformRouters} from "@tsed/platform-router";

import {PlatformExpressHandler} from "./PlatformExpressHandler.js";

vi.mock("@tsed/platform-http");

describe("PlatformExpressHandler", () => {
  beforeEach(() =>
    DITest.create({
      imports: [
        {
          token: PlatformRouters,
          use: {
            prebuild: vi.fn(),
            hooks: {
              on: vi.fn().mockReturnThis()
            }
          }
        }
      ]
    })
  );
  afterEach(() => DITest.reset());
  it("should call middleware", async () => {
    const instance = inject(PlatformExpressHandler);
    const response: any = {};
    const $ctx: any = {
      getRequest: vi.fn().mockReturnThis(),
      getResponse: vi.fn().mockReturnThis()
    };
    $ctx.data = (req: any, res: any, cb: any) => {
      cb();
    };

    await instance.onResponse(response, $ctx);
  });
});
