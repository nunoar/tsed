import {join} from "path";
import getAbsoluteFSPath from "swagger-ui-dist/absolute-path.js";

export const SWAGGER_UI_DIST = getAbsoluteFSPath();
export const ROOT_DIR = join(import.meta.dirname, "..");
