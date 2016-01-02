# react-testing-recipes
A list of recipes to testing your React code

### Setup

Install testing dependencies

```
$ npm i enzyme react-addons-test-utils babel-tape-runner faucet --save-dev
$ npm i react react-dom --save
```

* **enzyme** - JavaScript Testing utilities for React http://airbnb.io/enzyme/
* **react-addons-test-utils** - ReactTestUtils makes it easy to test React components in the testing framework of your choice
* **babel-tape-runner** - Babel + Tape runner for your ESNext code
* **faucet** - human-readable TAP summarizer

Lint your ES6 and React code with [standard](https://github.com/feross/standard) and better test error message with snazzy.

```
$ npm i standard snazzy --save-dev
```
* standard - :star2: JavaScript Standard Style http://standardjs.com
* snazzy - Format JavaScript Standard Style as Stylish (i.e. snazzy) output

Add `scripts` to `package.json`

```JSON
{
  "scripts": {
    "lint": "standard src/**/*.js | snazzy",
    "pretest": "npm run lint",
    "test": "babel-tape-runner tests/**/*.test.js | faucet"
  }
}
```

### Running test

You can start lint with `npm run lint` and running tests with `npm test`, `lint` is part of the test as we defined in `pretest`.

### 

###  

### Tools

### License
MIT
