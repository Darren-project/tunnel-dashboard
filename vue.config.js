// Support storing environment variables in a file named "testenv"
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Read environment variables from "testenv". Override environment vars if they are already set.
const TESTENV = path.resolve(__dirname, '.env');
if (fs.existsSync(TESTENV)) {
  const envConfig = dotenv.parse(fs.readFileSync(TESTENV));
  Object.keys(envConfig).forEach((k) => {
    process.env[k] = envConfig[k];
  });
}
process.env.CLIENT_ID = process.env.CLIENT_ID || process.env.SPA_CLIENT_ID;
process.env.USE_INTERACTION_CODE = process.env.USE_INTERACTION_CODE || false;

const env = {};

// List of environment variables made available to the app
[
  'ISSUER',
  'CLIENT_ID',
  'USE_INTERACTION_CODE',
  'API_URL',
].forEach(function (key) {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} must be set. See README.md`);
  }
  env[key] = JSON.stringify(process.env[key]);
});

module.exports = {
  devServer: {
    hot: false,
    liveReload: false
  },
  chainWebpack: config => {
    config
      .plugin('define')
      .tap(args => {
        const base = args[0]['process.env'];
        args[0]['process.env'] = {
          ...base,
          ...env,
        };
        args[0].title = "Tunnel Manager";
        return args;
      })
  },
  runtimeCompiler: true,
  publicPath: '/'
}
