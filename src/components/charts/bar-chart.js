import PropTypes from 'prop-types' // ES6

import { max, range } from 'd3-array'
import { scaleBand, scaleLinear } from 'd3-scale'
import React from 'react'

import { formatDate, formatNumber } from '../../utilities/visualization'
import chartStyles from './charts.module.scss'

const BarChart = ({
  data,
  fill,
  height,
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
  xTicks,
  width,
  yMax,
  yTicks,
  showTicks,
}) => {
  const totalXMargin = marginLeft + marginRight
  const totalYMargin = marginTop + marginBottom
  const xScale = scaleBand()
    .domain(data.map(d => d.date))
    .range([0, width - totalXMargin])
    .padding(0.1)

  const yScale = scaleLinear()
    .domain([0, yMax || max(data, d => d.value)])
    .nice()
    .range([height - totalYMargin, 0])

  const xScaleDomain = xScale.domain()
  const ticks = range(
    0,
    xScaleDomain.length,
    Math.floor(xScaleDomain.length / xTicks),
  )

  return (
    <svg className={chartStyles.chart} viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${marginLeft} ${marginTop})`}>
        <g>
          {yScale.ticks(yTicks).map((tick, i) => (
            <g key={tick}>
              <svg
                y={yScale(tick) + 4}
                x="-10"
                className={chartStyles.yTickLabel}
              >
                {i < showTicks && (
                  <text className={chartStyles.label} textAnchor="end">
                    {formatNumber(tick)}
                  </text>
                )}
              </svg>
              {i < showTicks && (
                <line
                  className={chartStyles.gridLine}
                  x1={0}
                  x2={width - totalXMargin}
                  y1={yScale(tick)}
                  y2={yScale(tick)}
                />
              )}
            </g>
          ))}
        </g>
      </g>

      <g transform={`translate(${marginLeft}, ${height - marginBottom})`}>
        {ticks.map(d => {
          const date = xScale.domain()[d]
          return (
            <text
              className={`${chartStyles.label} ${chartStyles.xTickLabel}`}
              key={d}
              x={xScale(date)}
              y="25"
            >{`${formatDate(date)}`}</text>
          )
        })}
      </g>

      <g transform={`translate(${marginLeft} ${marginTop})`}>
        {data.map(d => (
          <rect
            key={d.date}
            x={xScale(d.date)}
            y={yScale(d.value)}
            height={yScale(0) - yScale(d.value)}
            width={xScale.bandwidth()}
            fill={fill}
          />
        ))}
      </g>
    </svg>
  )
}

BarChart.defaultProps = {
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  xTicks: 5,
  yMax: null,
  yTicks: 4,
  showTicks: 4,
}

BarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.instanceOf(Date).isRequired,
      value: PropTypes.number,
    }),
  ).isRequired,
  fill: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number,
  marginRight: PropTypes.number,
  marginTop: PropTypes.number,
  xTicks: PropTypes.number,
  yMax: PropTypes.number,
  yTicks: PropTypes.number,
  showTicks: PropTypes.number,
}
export default BarChart
