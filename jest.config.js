const { pathsToModuleNameMapper } = require('ts-jest/utils');
const ts = require('typescript');

function readTsConfig(path = './', configName = 'tsconfig.json') {
  const parseConfigHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    useCaseSensitiveFileNames: true,
  };

  const configFileName = ts.findConfigFile(path, ts.sys.fileExists, configName);
  const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
  const compilerOptions = ts.parseJsonConfigFileContent(
    configFile.config,
    parseConfigHost,
    path,
  );
  return compilerOptions;
}

const baseConfig = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.(j)sx?$': '<rootDir>/scripts/babel-jest',
  },
  globals: {
    'ts-jest': {
      babelConfig: 'babel.config.js',
      tsConfig: '<rootDir>/tsconfig.test.json',
    },
  },
  coveragePathIgnorePatterns: [
    'node_modules',
    'react-integration/hooks/useSelection',
    'packages/test',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(
      readTsConfig('./', 'tsconfig.test.json').options.paths,
      {
        prefix: '<rootDir>/',
      },
    ),
  },
  testURL: 'http://localhost',
};

const packages = ['legacy', 'rest-hooks', 'normalizr', 'use-enhanced-reducer'];

const projects = [
  {
    ...baseConfig,
    rootDir: __dirname,
    roots: packages.map(pkgName => `<rootDir>/packages/${pkgName}/src`),
    displayName: 'ReactDOM',
    setupFiles: ['<rootDir>/scripts/testSetup.web.js'],
    testRegex:
      '(/__tests__/((?!\\.native-test).)*|(\\.|/)(test|spec|web))\\.(j|t)sx?$',
  },
  {
    ...baseConfig,
    rootDir: __dirname,
    roots: packages.map(pkgName => `<rootDir>/packages/${pkgName}/src`),
    displayName: 'React Native',
    preset: 'react-native',
    testRegex:
      '(/__tests__/((?!\\.web).)*|(\\.|/)(test|spec|native-test))\\.(j|t)sx?$',
    setupFiles: ['<rootDir>/scripts/testSetup.native.js'],
    transformIgnorePatterns: ['poiuytre'],
    transform: {
      '/node_modules/.+\\.js$':
        '<rootDir>/node_modules/react-native/jest/preprocessor.js',
      ...baseConfig.transform,
    },
  },
];

module.exports = {
  projects,
};
