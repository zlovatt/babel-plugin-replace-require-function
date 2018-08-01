# babel-plugin-replace-require-function

Replaces the 'require' function with whatever string you give it. You can replace 'require' for only specific module imports, otherwise the tool will default to replacing all builtins.

## But why?

[Adobe's CEP](https://github.com/Adobe-CEP) context uses a built-in version of node. When using specific modules, you may want to use Adobe's instance of these modules as opposed to the global node context.

There may be other use cases for this, but... maybe not. This was developed to fix a specific issue, and hopefully someone else may find it useful!

## Contribution

The logic here was based around a few other 'replace string'-type babel plugins I've found. I don't really understand Babel transforms at all, so the logic here may be super ineffecient. If you're able and willing to improve any of this, then.. please, please, please do.

---

## Options

- `newRequire`: Required. The name of the new 'require' function.
- `filenames`: Optional, array of filenames to check. Default: check every file.
- `modules`: Optional, array of module names to replace 'require' with. Default: replace when any builtin is called.
- `originalRequire`: Optional, the name of the original 'require' command to check. Default: 'require'

---

## Sample

Definition:
```
{
  "plugins": [
    [
      "replace-require-function", {
        "filenames": [
          "directory-tree.js",
          "validator.js"
        ],
        "modules": [
          "fs",
          "path"
        ],
        "newRequire": "window.cep_node.require"
      }
    ]
  ]
}
```

Input:
```
const fs = require("fs");
const path = require("path");
const cp = require("child_process");
```

Output:
```
const fs = window.cep_node.require("fs");
const path = window.cep_node.require("path");
const cp = require("child_process");
```
