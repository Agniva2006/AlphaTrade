"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeObjects = mergeObjects;
exports.validateOptions = validateOptions;
exports.setOptions = setOptions;
const cookieJar_js_1 = require("../cookieJar.js");
const logger_js_1 = require("./logger.js");
const optionsJson_schema_js_1 = __importDefault(require("./optionsJson.schema.js"));
const validateAndCoerceTypes_js_1 = __importDefault(require("../validateAndCoerceTypes.js"));
const index_js_1 = require("../validate/index.js");
const definitions = (0, index_js_1.getTypedDefinitions)(optionsJson_schema_js_1.default);
function mergeObjects(original, objToMerge) {
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
function validateOptions(options) {
    // Validation of simple JSON types
    (0, validateAndCoerceTypes_js_1.default)({
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
    if (options.cookieJar && !(options.cookieJar instanceof cookieJar_js_1.ExtendedCookieJar)) {
        throw new Error("cookieJar must be an instance of ExtendedCookieJar");
    }
    options.logger && (0, logger_js_1.validateOptions)(options.logger);
}
function setOptions(options) {
    validateOptions.call(this, options);
    mergeObjects(this._opts, options);
}
