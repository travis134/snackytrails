const CracoAlias = require("craco-alias");
const path = require("path");

module.exports = {
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
        devServerConfig.devMiddleware.writeToDisk = true;
        return devServerConfig;
    },
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: "tsconfig",
                baseUrl: "./src",
                tsConfigPath: "./tsconfig.paths.json",
            },
        },
    ],
    webpack: {
        configure: (webpackConfig) => {
            const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
                ({ constructor }) =>
                    constructor && constructor.name === "ModuleScopePlugin"
            );

            webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

            webpackConfig.module.rules.push({
                test: /\.ts(x)?$/,
                loader: "ts-loader",
                include: [path.resolve(__dirname, "./shared")],
                options: {
                    transpileOnly: true,
                    configFile: "tsconfig.json",
                },
            });

            return webpackConfig;
        },
    },
};
