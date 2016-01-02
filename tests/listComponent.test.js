import React from 'react'
import test from 'tape'
import { shallow } from 'enzyme'
import sinon from 'sinon'

import ListComponent from '../src/ListComponent'

test('ListComponent component', assert => {
  const msg = 'should react to mouseEvent'

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
})
