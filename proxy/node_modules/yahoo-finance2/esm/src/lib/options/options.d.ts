import type { YahooFinanceOptions as YahooFinanceOptionsJSON } from "./optionsJson.js";
import { ExtendedCookieJar } from "../cookieJar.js";
import type { YahooFinance } from "../../createYahooFinance.js";
import { type Logger } from "./logger.js";
export type { NOTICE_IDS, QueueOptions, QuoteCombineOptions, ValidationOptions, } from "./optionsJson.js";
export type { ModuleOptions, YahooFinanceFetchModuleOptions, } from "../moduleCommon.js";
/**
 * Non-primitive options for {@linkcode YahooFinance} (i.e. classes, instances, funcs).
 *
 * **See {@linkcode YahooFinanceOptionsJSON} for additional primitive options.**
 *
 * @example
 * ```ts
 * import YahooFinance from 'yahoo-finance2';
 * const yahooFinance = new YahooFinance({
 *   suppressNotices: ["yahooSurvey"],
 *   // etc
 * });
 * ```
 *
 * @see {@link YahooFinanceOptionsJSON} for primitive options.
 */
export interface YahooFinanceOptions extends YahooFinanceOptionsJSON {
    /**
     * By default, we use an in-memory cookie store to re-use Yahoo cookies across requests.
     * This is usually fine for long running servers, but with serverless / edge functions
     * for example - since the initial cookie retrieval takes longer - you can speed up future
     * requests by providing a custom cookie jar with a database/redis backend.  For the CLI, we
     * likewise use a filesystem-backed cookie jar for this purpose.  See
     * {@linkcode ExtendedCookieJar} for more details and examples (based on
     * {@link https://www.npmjs.com/package/tough-cookie|npm:tough-cookie}).
     */
    cookieJar?: ExtendedCookieJar;
    /**
     * By default, we use the built-in `console` for logging, but you can override it with
     * anything you like.  You can use this to control logging output or send your logs to
     * a logging service.  See
     * {@linkcode Logger} for more details and examples.
     */
    logger?: Logger;
    /**
     * By default, we'll use `globalThis.fetch` at call time for HTTP requests, however,
     * you can override it with a custom fetch implementation.  You can also override
     * `fetch` per request with {@linkcode ModuleOptions}.
     */
    fetch?: typeof fetch;
}
export type { ExtendedCookieJar, Logger, YahooFinanceOptionsJSON };
type Obj = Record<string, unknown>;
export declare function mergeObjects(original: Obj, objToMerge: Obj): void;
export declare function validateOptions(this: YahooFinance, options: YahooFinanceOptions): void;
export declare function setOptions(this: YahooFinance, options: YahooFinanceOptions): void;
//# sourceMappingURL=options.d.ts.map