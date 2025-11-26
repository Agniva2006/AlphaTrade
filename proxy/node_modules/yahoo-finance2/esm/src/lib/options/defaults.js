import { ExtendedCookieJar } from "../cookieJar.js";
import { defaultOptions as defaultLoggerOptions } from "./logger.js";
import { defaultOptions as defaultQuoteCombineOptions } from "../../other/quoteCombine.js";
const options = {
    YF_QUERY_HOST: "query2.finance.yahoo.com",
    cookieJar: new ExtendedCookieJar(),
    queue: {
        concurrency: 4, // Min: 1, Max: Infinity
        // timeout: 60,
    },
    validation: {
        logErrors: true,
        logOptionsErrors: true,
        allowAdditionalProps: true,
    },
    logger: defaultLoggerOptions,
    quoteCombine: defaultQuoteCombineOptions,
    versionCheck: true,
};
export default options;
