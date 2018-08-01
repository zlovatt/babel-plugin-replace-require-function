module.exports = () => {
  var builtins = [
    "assert",
    "async_hooks",
    "buffer",
    "child_process",
    "cluster",
    "console",
    "constants",
    "crypto",
    "dgram",
    "dns",
    "domain",
    "events",
    "fs",
    "http",
    "http2",
    "https",
    "inspector",
    "module",
    "net",
    "os",
    "path",
    "perf_hooks",
    "process",
    "punycode",
    "querystring",
    "readline",
    "repl",
    "stream",
    "string_decoder",
    "timers",
    "tls",
    "trace_events",
    "tty",
    "url",
    "util",
    "v8",
    "vm",
    "zlib"
  ];

  return {
    visitor: {
      VariableDeclaration(path, state) {
        const opts = state.opts;

        if (Object.keys(opts).length === 0) {
          return;
        }

        if (!opts.hasOwnProperty("newRequire")) {
          console.error("Missing newRequire!")
        }

        var filepath = path.hub.file.opts.filename;
        var filename = filepath.substring(filepath.lastIndexOf("/") + 1)

        // Get the user's list of filenames to check.
        // If it doesn't exist, check all files
        var useFilesFilter = opts.hasOwnProperty("filenames") && opts.filenames.length > 0;
        if (useFilesFilter && opts.filenames.indexOf(filename) === -1)
          return;

        // A lot of nonsense to say "can we find an identifier and a callee?"
        if (typeof path.node === "undefined" ||
          path.node.declarations.length === 0 ||
          typeof path.node.declarations[0].id === "undefined" ||
          typeof path.node.declarations[0].id.name === "undefined" ||
          path.node.declarations[0].init == null ||
          typeof path.node.declarations[0].init.callee === "undefined" ||
          typeof path.node.declarations[0].init.callee.name === "undefined")
          return;

        var module = path.node.declarations[0].id.name.toLowerCase();
        var callee = path.node.declarations[0].init.callee.name.toLowerCase();

        // If the user specified modules, use those.
        // Otherwise, use builtins
        var modulesList = builtins;

        if (opts.hasOwnProperty("modules") && opts.modules.length > 0) {
          modulesList = opts.modules;
        }

        // IF user didn't specify 'originalRequire', assume 'require'
        var originalRequire = opts.hasOwnProperty("originalRequire") ? opts.originalRequire : "require";
        if (callee !== originalRequire || modulesList.indexOf(module) === -1) {
          return;
        }

        path.node.declarations[0].init.callee.name = opts.newRequire;
      }
    }
  };
};
