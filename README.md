# Analytics Scroll Depth

[![npm package](https://nodei.co/npm/analytics-scroll-depth.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/analytics-scroll-depth/)

Analytics Scroll Depth is a small, simple plugin that will pass your visitors scroll behavior to analytics.

---

## Installation
`npm install --save analytics-scroll-depth`

## Usage
```
import scrollDepth from 'analytics-scroll-depth'

scrollDepth()
```

## Configuration
```
scrollDepth({
  throttle              : 250,
  minHeight             : 0,
  scrollElement         : document.documentElement,
  percentages           : [0.25, 0.5, 0.75, 0.9, 0.95, 0.99],
  pixelDepthInterval    : 500,
  elements              : [],
  dataLayer             : window.dataLayer,
  trackerName           : '',
  eventName             : 'CustomEvent',
  eventCategory         : 'Scroll Depth',
  percentageDepthAction : 'Percentage Depth',
  pixelDepthAction      : 'Pixel Depth',
  elementAction         : 'Element Depth',
  nonInteraction        : true,
})
```

| Setting               | Unit         | Default                            |                                                                                                         |
|-----------------------|--------------|------------------------------------|---------------------------------------------------------------------------------------------------------|
| throttle              | ms           | 250                                | Throttle time                                                                                           |
| minHeight             | px           | 0                                  | The minimum height requirement for a page to collect scroll data                                        |
| scrollElement         | node         | document.documentElement           | The element in which you wish to track scrolling.                                                       |
| percentages           | array<float> | [0.25, 0.5, 0.75, 0.9, 0.95, 0.99] | An array of percentages that will be passed to analytics when a visitor reaches that point on the page  |
| pixelDepthInterval    | int          | 500                                | When a visitor passes this point * n, the value will be passed to analytics.                            |
| elements              | array<node>  | []                                 | An array of elements to track. The element will be passed to analytics when it is visible in the window |
| dataLayer             | array        | window.dataLayer                   | Your dataLayer element                                                                                  |
| trackerName           | string       | ''                                 | If you use a tracker name, put it here                                                                  |
| eventName             | string       | 'CustomEvent'                      | The event name used by your tag manger to capture the custom event                                      |
| eventCategory         | string       | 'Scroll Depth'                     | The event category that will be reported to analytics                                                   |
| percentageDepthAction | string       | 'Percentage Depth'                 | The event action that will be reported to analytics for percentage depth                                |
| pixelDepthAction      | string       | 'Pixel Depth'                      | The event action that will be reported to analytics for pixel depth                                     |
| elementAction         | string       | 'Element Depth'                    | The event action that will be reported to analytics for element depth                                   |
| nonInteraction        | bool         | true                               | If the event should be sent as a nonInteraction hit                                                     |