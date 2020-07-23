"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tsify_1 = __importDefault(require("tsify"));
var typescript_1 = require("typescript");
var fs_1 = require("fs");
var browserify = require("browserify");
var typescript = require("typescript");
function testOpt1() {
    var opt1 = {
        typescript: typescript,
        project: "./src/tsconfig.json",
    };
    browserify()
        .plugin(tsify_1.default, opt1)
        .add("./src/main.ts")
        .bundle()
        .pipe(fs_1.createWriteStream("./out/opt1.js"));
}
function testOpt2() {
    var opt2 = {
        typescript: "typescript",
        project: {
            target: typescript_1.ScriptTarget.ES5,
            module: typescript_1.ModuleKind.CommonJS,
            strict: true,
            moduleResolution: typescript_1.ModuleResolutionKind.NodeJs,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
        },
    };
    browserify()
        .plugin(tsify_1.default, opt2)
        .add("./src/main.ts")
        .bundle()
        .pipe(fs_1.createWriteStream("./out/opt2.js"));
}
testOpt1();
testOpt2();
