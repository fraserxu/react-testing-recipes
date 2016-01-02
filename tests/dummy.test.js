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
})
