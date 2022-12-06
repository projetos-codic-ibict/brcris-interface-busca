import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled, { withTheme } from 'styled-components'
import { withSearch } from '@elastic/react-search-ui'
import _get from 'lodash/get'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const Container = styled.div`
  padding: 0 0.33rem 1.25rem;
`

const RangeSlider = ({
  options,
  label,
  field,
  setFilter,
  filters,
  min,
  max,
  prefix,
  step,
}) => {
  const [value, setValue] = useState([
    parseInt(_get(filters[0], 'price[0].from', min)),
    parseInt(_get(filters[0], 'price[0].to', max)),
  ])

  const updateFilterValue = () => {
    console.log('updateFilterValue')
    setFilter(field, { from: value[0], to: value[1] })
  }

  useEffect(() => {
    if (!filters[0]) {
      setValue([min, max])
    }
  }, [filters])

  return (
    <>
      <legend className="sui-facet__title">{label}</legend>
      <Container options={options}>
        <Slider
          range
          min={parseInt(min)}
          max={parseInt(max)}
          value={value}
          marks={{
            [min]: min,
            [max]: max,
          }}
          onChange={setValue}
          onBlur={updateFilterValue}
          step={parseInt(step)}
          tipFormatter={(value) => value}
        />
      </Container>
    </>
  )
}

RangeSlider.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  theme: PropTypes.object,
  label: PropTypes.string.isRequired,
  prefix: PropTypes.string,
  field: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(PropTypes.object).isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
}

RangeSlider.defaultProps = {
  step: 1,
}

export default withSearch(({ filters, setFilter }) => ({ filters, setFilter }))(
  withTheme(RangeSlider)
)
