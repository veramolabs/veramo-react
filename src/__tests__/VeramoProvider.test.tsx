import React from 'react'
import renderer from 'react-test-renderer'
import { VeramoProvider } from '../VeramoProvider'

test('Renders', () => {
  const component = renderer.create(
    //@ts-ignore
    <VeramoProvider agent={{}}>
      <div />
    </VeramoProvider>,
  )
  let tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
