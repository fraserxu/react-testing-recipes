react-testing-recipes
=====================

A list of recipes to testing your React code

Part of the code and ideas are borrowed from **React Testing Cookbook** series on [egghead.io](https://egghead.io) with awareness of personal choice of tools.

Setup
-----

Install babel 6 preset family

```
npm i babel-preset-es2015 babel-preset-react babel-preset-stage-0 babel-core babel-cli --save-dev
```

Add `.babelrc`

```JSON
{
  "presets": ["es2015", "stage-0", "react"]
}

```

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
* **standard** - :star2: JavaScript Standard Style http://standardjs.com
* **snazzy** - Format JavaScript Standard Style as Stylish (i.e. snazzy) output

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

#### To build a jQuery ready JSDOM env

```JavaScript
import fs from 'fs'
import jsdom from 'jsdom'
import resolve from 'resolve'

const jQuery = fs.readFileSync(resolve.sync('jquery'), 'utf-8')

jsdom.env('<!doctype html><html><body></body></html>', {
  src: [jQuery]
}, (err, window) => {
  console.log('Voilà!', window.$('body'))
})
```

#### Test component life cycle

```JavaScript
import { spyLifecycle } from 'enzyme'

// This part inject document and window variable for the DOM mount test
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
const win = doc.defaultView
global.document = doc
global.window = win

spyLifecycle(AutosuggestKeyBinderComponent)

let container = doc.createElement('div')
render(<AutosuggestKeyBinderComponent {...props} />, container)

assert.true(AutosuggestKeyBinderComponent.prototype.componentDidMount.calledOnce, 'calls componentDidMount once')

unmountComponentAtNode(container)

assert.true(AutosuggestKeyBinderComponent.prototype.componentWillUnmount.calledOnce, 'calls componentWillUnmount once')
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

First we prepare a simple React `ListComponent` class, the list item will take a `handleMouseDown` callback function from props.

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

Than we can start to test it.

```JavaScript
import ListComponent from './ListComponent'
import sinon from 'sinon'

// ...

// we spy on the `handleMouseDown` function
const handleMouseDown = sinon.spy()
const props = {
  user: {
    name: 'fraserxu',
    title: 'Frontend Developer'
  },
  handleMouseDown
}
const $ = shallow(<ListComponent {...props} />)
const listItem = $.find('li')

// emulate the `mouseDown` event
listItem.simulate('mouseDown')

// check if the function get called
const actual = handleMouseDown.calledOnce
const expected = true

assert.equal(actual, expected, msg)
assert.end()
```

#### Test custom data-attribute

First we prepare a simple React `ListComponent` class, the list item will have a custom data attribute `data-selected` from props.

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

This part is a little tricky. As for normal DOM node, we can [access the data attribute](https://developer.mozilla.org/en/docs/Web/Guide/HTML/Using_data_attributes) with `$.node.dataset.isSelected`, I tried to get the data attribute for a while and the only solution I found is `listItemNode.getAttribute('data-selected')`.

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

// here is the trick part
assert.equal(listItemNode.getAttribute('data-selected'), 'true', msg)
assert.end()
```

#### Test JSX equal with `tape-jsx-equals`

Same as [expect-jsx](https://github.com/algolia/expect-jsx), you can use [tape-jsx-equal](https://www.npmjs.com/package/tape-jsx-equals) to test JSX strings.

```
$ npm install --save-dev extend-tape
$ npm install --save-dev tape-jsx-equals
```

```JavaScript
import tape from 'tape'
import addAssertions from 'extend-tape'
import jsxEquals from 'tape-jsx-equals'

const test = addAssertions(tape, { jsxEquals })

assert.jsxEquals(result, <div className='box color-red'></div>)
```

Roadmap
---------

This is just the beginning of this recipes and is quite limited to the bacis of testing React code. I'll add more along working and learning. If you are interestd to contribue or want to know how to test certain code, send a pull request here or open a Github issue.

Happy testing!

Further readings
---------------

* [Why I use Tape Instead of Mocha & So Should You](https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4)
* [A pure component dev starter kit for React.](https://github.com/ericelliott/react-pure-component-starter)

Special thanks to [@ericelliott](https://github.com/ericelliott) for sharing his knowledge and effort to make our life easier writing JavaScript.

### License
MIT
