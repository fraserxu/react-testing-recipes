react-testing-recipes
=====================

A list of recipes to testing your React code

Part of the code and ideas are borrowed from **React Testing Cookbook** series on [egghead.io](https://egghead.io) with awareness of personal choice of tools.

Setup
-----

Install testing dependencies

```
$ npm i tape sinon enzyme react-addons-test-utils babel-tape-runner faucet --save-dev
$ npm i react react-dom --save
```
* **tape** - tap-producing test harness for node and browsers
* **enzyme** - JavaScript Testing utilities for React http://airbnb.io/enzyme/
* **react-addons-test-utils** - ReactTestUtils makes it easy to test React components in the testing framework of your choice
* **babel-tape-runner** - Babel + Tape runner for your ESNext code
* **faucet** - human-readable TAP summarizer
* **sinon** - Standalone test spies, stubs and mocks for JavaScript.

Lint your ES6 and React code with [standard](https://github.com/feross/standard) and better test error message with snazzy.

```
$ npm i standard snazzy --save-dev
```
In order to make standard understand your `ES6` code and `JSX` syntax, you may also need to install `babel-eslint` and the following to `package.json`.

```JSON
{
  "standard": {
    "parser": "babel-eslint"
  }
}
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

Running test
------------

* You can start lint with `npm run lint`
* Running tests with `npm test`, `lint` is part of the test as we defined in `pretest`.

What to test
----------------

#### Shallow Rendering

> Shallow rendering is useful to constrain yourself to testing a component as a unit, and to ensure that your tests aren't indirectly asserting on behavior of child components.

Make sure you always import `React` to let the test runner know you have JSX syntax in your code.

```JavaScript
import React from 'react'
import test from 'tape'
import { shallow } from 'enzyme'

const DummyComponent = (props) => <div>{props.content}</div>

test('Dummy component', assert => {
  const msg = 'should render dummy content'

  const expected = '<div>dummy content</div>'

  const props = {
    content: 'dummy content'
  }

  const $ = shallow(<DummyComponent {...props} />)
  const output = $.html()

  assert.equal(output, expected, msg)

  assert.end()
}))
```

#### Check a component has certain className

```JavaScript
assert.true($.hasClass('myClassName'), msg)
```

#### Check a DOM node exist

```JavaScript
assert.true($.find('.someDOMNode').length, msg)
```

#### Check a component has child element

```JavaScript
const expected = props.data.length
assert.equal($.find('.childClass').children().length, expected, msg)
```
#### Emulate mouse event

```JavaScript
// ListComponent
class ListComponent extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { user, handleMouseDown } = this.props
    return (
      <li onMouseDown={handleMouseDown}>{user.name}</li>
    )
  }
}

export default ListComponent
```

```JavaScript
import ListComponent from './ListComponent'
import sinon from 'sinon'

// ...

const handleMosueDown = sinon.spy()
const props = {
  user: {
    name: 'fraserxu',
    title: 'Frontend Developer'
  },
  handleMouseDown
}
const $ = shallow(<ListComponent {...props} />)
const listItem = $.find('li')

listItem.simulate('mouseDown')
const actual = handleMouseDown.calledOnce
const expected = true

assert.equal(acutal, expected, msg)
assert.end()
```

#### Test custom data-attribute

```JavaScript
// ListComponent
class ListComponent extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { user, handleMouseDown, isSelected } = this.props
    return (
      <li onMouseDown={handleMouseDown} data-selected={isSelected}>>{user.name}</li>
    )
  }
}

export default ListComponent
```

```JavaScript
import ListComponent from './ListComponent'

// ...

const noop = () => {}
const props = {
  user: {
    name: 'fraserxu',
    title: 'Frontend Developer'
  },
  handleMouseDown: noop,
  isSelected: true
}
const $ = shallow(<ListComponent {...props} />)
const listItem = $.find('li').node

assert.equal(listItemNode.getAttribute('data-selected'), 'true', msg)
assert.end()
```

### License
MIT
