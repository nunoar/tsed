import {Controller, DIContext, inject, injector} from "@tsed/di";
import {PlatformTest} from "@tsed/platform-http/testing";
import {UseBefore} from "@tsed/platform-middlewares";
import {Context, PlatformParams, PlatformParamsScope} from "@tsed/platform-params";
import {EndpointMetadata, Get, JsonOperationRoute} from "@tsed/schema";

import {PlatformRouter} from "../src/domain/PlatformRouter.js";
import {AlterEndpointHandlersArg, PlatformRouters} from "../src/domain/PlatformRouters.js";
import {PlatformHandlerMetadata, useContextHandler} from "../src/index.js";

@Controller("/controller")
@UseBefore(function useBefore() {})
class MyController {
  @Get("/")
  get(@Context() $ctx: Context) {
    return $ctx;
  }
}

function createAppRouterFixture() {
  const platformRouters = inject(PlatformRouters);
  const platformParams = inject(PlatformParams);
  const appRouter = inject(PlatformRouter);

  platformRouters.hooks.destroy();

  injector().addProvider(MyController, {});

  platformRouters.hooks.on("alterHandler", (handlerMetadata: PlatformHandlerMetadata) => {
    if (handlerMetadata.isRawFn() || handlerMetadata.isResponseFn()) {
      return handlerMetadata.handler;
    }

    return handlerMetadata.isCtxFn()
      ? (scope: PlatformParamsScope) => handlerMetadata.handler(scope.$ctx)
      : platformParams.compileHandler(handlerMetadata);
  });

  return {appRouter, platformRouters, platformParams};
}

describe("routers with alter handlers", () => {
  beforeEach(() => PlatformTest.create());
  afterEach(() => PlatformTest.reset());
  it("should declare router - appRouter", async () => {
    const {appRouter, platformRouters} = createAppRouterFixture();

    platformRouters.hooks.on("alterEndpointHandlers", (handlers: AlterEndpointHandlersArg, operationRoute: JsonOperationRoute) => {
      const {endpoint} = operationRoute;

      handlers.before.unshift(
        useContextHandler(($ctx: DIContext) => {
          $ctx.set(EndpointMetadata, endpoint);
        })
      );

      return handlers;
    });

    const router = platformRouters.from(MyController);

    appRouter.use("/rest", router);

    const layers = platformRouters.getLayers(appRouter);

    expect(layers.length).toEqual(1);

    const $ctx: any = {};
    await (layers[0].getArgs() as any)[1]({$ctx});

    expect($ctx.endpoint).toBeDefined();
  });
});
