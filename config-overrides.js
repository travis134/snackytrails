const {
    override,
    removeModuleScopePlugin,
    getBabelLoader,
    addWebpackAlias,
} = require("customize-cra");
const path = require("path");

const updateAliases = (config) => {
    const aliases = {
        "@alias": ["absolute/path/to/base/url"],
    };

    return addWebpackAlias(aliases)(config);
};

const updateIncludes = (config) => {
    const loader = getBabelLoader(config, false);
    const commonPath = path
        .normalize(path.join(process.cwd(), "./tsconfig.json"))
        .replace(/\\/g, "\\");
    loader.include = [loader.include, commonPath];
    return config;
};

module.exports = override(
    updateAliases,
    updateIncludes,
    removeModuleScopePlugin()
);
