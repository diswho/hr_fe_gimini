// frontend/craco.config.js
module.exports = {
  devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
    // Store the original onBeforeSetupMiddleware and onAfterSetupMiddleware
    // to see if react-scripts sets them up.
    const originalOnBeforeSetupMiddleware = devServerConfig.onBeforeSetupMiddleware;
    const originalOnAfterSetupMiddleware = devServerConfig.onAfterSetupMiddleware;

    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // If react-scripts had a onBeforeSetupMiddleware, call it.
      // This is to retain the default CRA behavior.
      if (originalOnBeforeSetupMiddleware) {
        originalOnBeforeSetupMiddleware(devServer);
      }

      // Example: Add a custom middleware before other middlewares
      // middlewares.unshift({
      //   name: 'my-custom-middleware',
      //   path: '/my-custom-route',
      //   middleware: (req, res) => {
      //     res.send('Hello from custom middleware!');
      //   },
      // });

      // If react-scripts had an onAfterSetupMiddleware, call it.
      // This is to retain the default CRA behavior.
      // Note: The original onAfterSetupMiddleware might try to return a modified
      // middlewares array or devServer object, which is not how setupMiddlewares works.
      // We are calling it here primarily for its side effects (like adding routes).
      if (originalOnAfterSetupMiddleware) {
        originalOnAfterSetupMiddleware(devServer);
      }

      // Important: `setupMiddlewares` must return the array of middlewares.
      return middlewares;
    };

    // Remove the old options to avoid conflicts or warnings
    delete devServerConfig.onBeforeSetupMiddleware;
    delete devServerConfig.onAfterSetupMiddleware;

    return devServerConfig;
  },
};
