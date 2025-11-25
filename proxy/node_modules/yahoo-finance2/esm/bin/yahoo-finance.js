#!/usr/bin/env node
import * as dntShim from "../_dnt.shims.js";
import * as path from "../deps/jsr.io/@std/path/1.1.2/mod.js";
import { FileCookieStore } from "tough-cookie-file-store";
import YahooFinance from "../src/index.js";
import { ExtendedCookieJar } from "../src/lib/cookieJar.js";
const cookiePath = path.join(dntShim.Deno.env.get("HOME"), ".yf2-cookies.json");
const cookieJar = new ExtendedCookieJar(new FileCookieStore(cookiePath));
const yahooFinance = new YahooFinance({
    cookieJar,
    suppressNotices: ["yahooSurvey"],
});
const moduleNames = Object.getOwnPropertyNames(YahooFinance.prototype)
    .filter((n) => !n.startsWith("_"));
// moduleNames.push("_chart"); // modules in development
const [moduleName, ...argsAsStrings] = dntShim.Deno.args;
if (moduleName === "--help" || moduleName === "-h") {
    console.log();
    console.log("Usage: yahoo-finance.js <module> <args>");
    console.log();
    console.log("Get a quote for AAPL:");
    console.log("$ yahoo-finance.js quoteSummary AAPL");
    console.log();
    console.log("Run the quoteSummary module with two submodules:");
    console.log('$ yahoo-finance.js quoteSummary AAPL \'{"modules":["assetProfile", "secFilings"]}\'');
    console.log();
    console.log("Available modules:");
    console.log(moduleNames.join(", "));
    dntShim.Deno.exit();
}
if (!moduleNames.includes(moduleName)) {
    console.log("No such module: " + moduleName);
    console.log("Available modules: " + moduleNames.join(", "));
    dntShim.Deno.exit();
}
console.log("Storing cookies in " + cookiePath);
function decodeArgs(stringArgs) {
    return stringArgs.map((arg) => {
        if (arg[0] === "{")
            return JSON.parse(arg);
        if (arg.match(/^[0-9\.]+$/))
            return Number(arg);
        return arg;
    });
}
(async function () {
    const args = decodeArgs(argsAsStrings);
    let result;
    try {
        // @ts-expect-error: yes, string is a bad index.
        result = await yahooFinance[moduleName](...args);
    }
    catch (error) {
        if (error instanceof Error) {
            // No need for full stack trace for CLI scripts
            console.error("Exiting with " + error.name + ": " + error.message);
        }
        else {
            console.error("Exiting with error: " + error);
        }
        dntShim.Deno.exit(1);
    }
    if (dntShim.Deno.stdout.isTerminal()) {
        console.dir(result, { depth: null, colors: true });
    }
    else
        console.log(JSON.stringify(result, null, 2));
})();
