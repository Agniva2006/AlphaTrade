import { ExtendedCookieJar } from "../cookieJar.js";
import { validateOptions as validateLogger } from "./logger.js";
import optionsJsonSchema from "./optionsJson.schema.js";
import validateAndCoerceTypes from "../validateAndCoerceTypes.js";
import { getTypedDefinitions } from "../validate/index.js";
const definitions = getTypedDefinitions(optionsJsonSchema);
export function mergeObjects(original, objToMerge) {
    const ownKeys = Reflect.ownKeys(objToMerge);
    for (const key of ownKeys) {
        if (typeof objToMerge[key] === "object") {
            mergeObjects(original[key], objToMerge[key]);
        }
        else {
            original[key] = objToMerge[key];
        }
    }
}
export function validateOptions(options) {
    // Validation of simple JSON types
    validateAndCoerceTypes({
        object: options,
        source: "_setOpts",
        type: "options",
        options: this._opts.validation,
        schemaOrSchemaKey: "#/definitions/YahooFinanceOptions",
        definitions,
        logger: this._opts.logger,
        logObj: this._logObj,
        versionCheck: this._opts.versionCheck,
    });
    if (options.cookieJar && !(options.cookieJar instanceof ExtendedCookieJar)) {
        throw new Error("cookieJar must be an instance of ExtendedCookieJar");
    }
    options.logger && validateLogger(options.logger);
}
export function setOptions(options) {
    validateOptions.call(this, options);
    mergeObjects(this._opts, options);
}
