# tsify-repo-types-issue

This repository creates a repro case for an issue with the types
(`index.d.ts`) on `tsify@4.0.2` and provides a patch for that issue.

## Requirements

- *yarn*: the `patch` protocol provided by yarn is used in the package.json for this repo.

## Issue

When using `tsify` in API form in a typescript project, the project will not
compile because of errors in the `tsify` type declaration.

## Reproduction

See `index.js` for the test file.

To see a reproduction of the issue, change the `tsify` entry in `package.json`
to "4.0.2" and run `make`. You should see the following:

```text
node_modules/tsify/index.d.ts:4:18 - error TS2430: Interface 'Options' incorrectly extends interface 'CompilerOptions'.
  Types of property 'project' are incompatible.
    Type 'string | CompilerOptions | undefined' is not assignable to type 'string | undefined'.
      Type 'CompilerOptions' is not assignable to type 'string'.

4 export interface Options extends CustomOptions, CompilerOptions {
                   ~~~~~~~

node_modules/tsify/index.d.ts:5:24 - error TS1340: Module 'typescript' does not refer to a type, but is used as a type here. Did you mean 'typeof import('typescript')'?

5  typescript?: string | import("typescript");
                         ~~~~~~~~~~~~~~~~~~~~

node_modules/tsify/index.d.ts:13:1 - error TS1046: Top-level declarations in .d.ts files must start with either a 'declare' or 'export' modifier.

13 function tsify(b: BrowserifyObject, opts: Options): any;
   ~~~~~~~~

node_modules/tsify/index.d.ts:15:1 - error TS2309: An export assignment cannot be used in a module with other exported elements.

15 export = tsify;
   ~~~~~~~~~~~~~~~


Found 4 errors.
```

## Fix

To see the fix, replace the entry for `tsify` with
"patch:tsify@4.0.2#./typefix.patch" and run `make`. You should see the
following:

```text
<some yarn output>
yarn exec tsc
node index.js
node out/opt1.js
okay
node out/opt2.js
okay
```

To test against different versions of typescript, pass a `version=` flag to make, e.g. `make version=3.8.3` or `make version=latest`.

This patch was tested against the following versions of typescript:

- 3.8.3
- 3.9.7
- 4.0.0-dev.20200722

## Patch

The patch that fixes this issue can be found at `typefix.patch`, but is short enough to inline here:

```diff
diff --git a/index.d.ts b/index.d.ts
index 938ba85aaf0e761ed47cf9b775ea42347c1f2155..0605195de3c0cab996fd8114868daae496b60946 100644
--- a/index.d.ts
+++ b/index.d.ts
@@ -1,8 +1,8 @@
 import { BrowserifyObject, CustomOptions } from "browserify";
 import { CompilerOptions, ModuleKind, ScriptTarget } from "typescript";

-export interface Options extends CustomOptions, CompilerOptions {
-	typescript?: string | import("typescript");
+export interface Options extends CustomOptions, Omit<CompilerOptions, "project"> {
+	typescript?: string | typeof import("typescript");
 	global?: boolean;
 	m?: ModuleKind;
 	p?: string | CompilerOptions;
@@ -10,6 +10,4 @@ export interface Options extends CustomOptions, CompilerOptions {
 	t?: ScriptTarget;
 }

-function tsify(b: BrowserifyObject, opts: Options): any;
-
-export = tsify;
+export default function tsify(b: BrowserifyObject, opts: Options): any;
```
