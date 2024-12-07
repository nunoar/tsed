import {Env} from "@tsed/core";

import {PlatformFastifySettings} from "./PlatformFastifySettings.js";

export * from "./PlatformFastifySettings.js";

export type PlatformFastifyPluginTypes = Function | /*Type<any> |*/ string;
export type PlatformFastifyPluginLoadingOptions = {env?: Env; use: PlatformFastifyPluginTypes; options?: any};
export type PlatformFastifyPluginSettings = PlatformFastifyPluginTypes | PlatformFastifyPluginLoadingOptions | any;

declare global {
  namespace TsED {
    export interface Configuration {
      /**
       * Configuration related to Koa platform application.
       */
      fastify: PlatformFastifySettings;
      plugins: PlatformFastifyPluginSettings[];
    }
  }
}
