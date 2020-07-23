import tsify, { Options } from "tsify";
import { ScriptTarget, ModuleKind, ModuleResolutionKind } from "typescript";
import { createWriteStream } from "fs";
import browserify = require("browserify");
import typescript = require("typescript");

function testOpt1() {
    const opt1: Options = {
        typescript,
        project: "./src/tsconfig.json",
    };

    browserify()
        .plugin(tsify, opt1)
        .add("./src/main.ts")
        .bundle()
        .pipe(createWriteStream("./out/opt1.js"));
}

function testOpt2() {
    const opt2: Options = {
        typescript: "typescript",
        project: {
            target: ScriptTarget.ES5,
            module: ModuleKind.CommonJS,
            strict: true,
            moduleResolution: ModuleResolutionKind.NodeJs,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
        },
    };
    browserify()
        .plugin(tsify, opt2)
        .add("./src/main.ts")
        .bundle()
        .pipe(createWriteStream("./out/opt2.js"));
}

testOpt1();
testOpt2();
