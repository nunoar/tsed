// @ts-ignore
import {presets} from "@tsed/vitest/presets";
import {defineConfig} from "vitest/config";

export default defineConfig(
  {
    ...presets,
    test: {
      ...presets.test,
      coverage: {
        ...presets.test.coverage,
        thresholds: {
          statements: 98.53,
          branches: 96.36,
          functions: 100,
          lines: 98.53
        }
      }
    }
  }
);