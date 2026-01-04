const path = require("path");
const child_process = require("child_process");
const fs = require("fs");

module.exports = function withSyncthingSo(config, props = {}) {
  return {
    ...config,
    plugins: [
      ...(config.plugins || []),

      // Optional: avoid Android duplicate .so issues
      [
        "expo-build-properties",
        {
          android: {
            packagingOptions: {
              pickFirst: ["**/*.so"]
            }
          }
        }
      ],

      // Run your existing script before native build
      function runSyncthingScript(c) {
        const projectRoot = c.modRequest.projectRoot;
        const scriptPath = path.join(projectRoot, 'syncthing', 'build-syncthing.py');

        if (!fs.existsSync(scriptPath)) {
          throw new Error(`Syncthing generation script not found at: ${scriptPath}`);
        }

        console.log(`\n🔧 Running Syncthing generation script: ${scriptPath}\n`);

        try {
          child_process.execFileSync(scriptPath, {
            cwd: projectRoot,
            stdio: "inherit",
            shell: true
          });
        } catch (err) {
          console.error("❌ Error running Syncthing generation script:", err.message);
          throw err;
        }

        console.log("\n✅ Syncthing generation script completed.\n");

        return c;
      }
    ]
  };
};