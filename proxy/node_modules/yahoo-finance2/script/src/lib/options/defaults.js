"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookieJar_js_1 = require("../cookieJar.js");
const logger_js_1 = require("./logger.js");
const quoteCombine_js_1 = require("../../other/quoteCombine.js");
const options = {
    YF_QUERY_HOST: "query2.finance.yahoo.com",
    cookieJar: new cookieJar_js_1.ExtendedCookieJar(),
    queue: {
        concurrency: 4, // Min: 1, Max: Infinity
        // timeout: 60,
    },
    validation: {
        logErrors: true,
        logOptionsErrors: true,
        allowAdditionalProps: true,
    },
    logger: logger_js_1.defaultOptions,
    quoteCombine: quoteCombine_js_1.defaultOptions,
    versionCheck: true,
};
exports.default = options;
