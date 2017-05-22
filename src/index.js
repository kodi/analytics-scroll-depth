import throttle from './lib/throttle'

export default function (settings = {}) {
  settings = Object.assign({
    throttle              : 250,
    minHeight             : 0,
    scrollElement         : document.documentElement,
    percentages           : [0.25, 0.5, 0.75, 0.9, 0.95, 0.99],
    pixelDepthInterval    : 500,
    elements              : [], // @TODO
    dataLayer             : window.dataLayer, // @TODO set up nonDataLayer tracking
    eventName             : 'CustomEvent',
    eventCategory         : 'Scroll Depth',
    percentageDepthAction : 'Percentage Depth',
    pixelDepthAction      : 'Pixel Depth',
    elementAction         : 'Element',
    nonInteraction        : true, // @TODO
  }, settings)

  let greatestScrollTop = 0

  function percentageDepth() {
    const scrollRatio = settings.scrollElement.scrollTop / (settings.scrollElement.scrollHeight - settings.scrollElement.clientHeight) // eslint-disable-line max-len
    settings.percentages.forEach((point, index) => {
      if (scrollRatio >= point) {
        settings.percentages.splice(index, 1)
        settings.dataLayer.push({
          event          : settings.eventName,
          eventCategory  : settings.eventCategory,
          eventAction    : settings.percentageDepthAction,
          eventLabel     : point,
          eventValue     : null,
          nonInteraction : settings.nonInteraction,
        })
      }
    })
  }

  function pixelDepth() {
    const scrollTop = settings.scrollElement.scrollTop
    while (scrollTop >= greatestScrollTop + settings.pixelDepthInterval) {
      greatestScrollTop += settings.pixelDepthInterval
      settings.dataLayer.push({
        event          : settings.eventName,
        eventCategory  : settings.eventCategory,
        eventAction    : settings.pixelDepthAction,
        eventLabel     : greatestScrollTop + settings.pixelDepthInterval,
        eventValue     : null,
        nonInteraction : settings.nonInteraction,
      })
    }
  }

  function elements() {
    settings.elements.forEach((element, index) => {
      if (
        element.offsetTop + element.clientHeight <
        settings.scrollElement.clientHeight + settings.scrollElement.scrollTop
      ) {
        settings.elements.splice(index, 1)
        settings.dataLayer.push({
          event          : settings.eventName,
          eventCategory  : settings.eventCategory,
          eventAction    : settings.elementAction,
          eventLabel     : element,
          eventValue     : null,
          nonInteraction : settings.nonInteraction,
        })
      }
    })
  }

  function onScroll() {
    if (settings.percentages) {
      percentageDepth()
    }
    if (settings.pixelDepthInterval) {
      pixelDepth()
    }
    if (settings.elements.length) {
      elements()
    }
  }

  function watch() {
    window.addEventListener('scroll', throttle(onScroll, settings.throttle), true)
  }

  if (
    settings.scrollElement.scrollHeight > settings.scrollElement.clientHeight &&
    settings.scrollElement.scrollHeight > settings.minHeight
  ) {
    watch()
  }
}
