module.exports = {
    transformIgnorePatterns: ['<rootDir>/node_modules'], // 避免对 node_modules 进行转换
    collectCoverageFrom: ['src/**/*.{js,ts}', '!**/__tests__/**'] // 指定需要收集 coverage 信息的源文件路径
};