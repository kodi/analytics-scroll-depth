/*!
 * Analytics Scroll Depth v0.1.1
 * (c) 2017 Nick Mickley
 * Released under the MIT License.
 */
var AnalyticsScrollDepth = (function () {
'use strict';

function throttle(fcn, threshhold) {
  var _this = this;

  var last = 0;
  var timeout = null;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var time = new Date().getTime();
    if (time < last + threshhold) {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        last = time;
        fcn.apply(_this, args);
      }, threshhold);
    } else {
      last = time;
      fcn.apply(_this, args);
    }
  };
}

var index = function () {
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  settings = Object.assign({
    throttle: 250,
    minHeight: 0,
    scrollElement: document.documentElement,
    percentages: [0.25, 0.5, 0.75, 0.9, 0.95, 0.99],
    pixelDepthInterval: 500,
    elements: [],
    dataLayer: window.dataLayer, // @TODO set up nonDataLayer tracking
    eventName: 'CustomEvent',
    eventCategory: 'Scroll Depth',
    percentageDepthAction: 'Percentage Depth',
    pixelDepthAction: 'Pixel Depth',
    elementAction: 'Element Depth',
    nonInteraction: true }, settings);

  var greatestScrollTop = 0;

  /**
   * Push an event when the user has scrolled past each percentage in settings.percentages
   * @return {void}
   */
  function percentageDepth() {
    var scrollRatio = settings.scrollElement.scrollTop / (settings.scrollElement.scrollHeight - settings.scrollElement.clientHeight); // eslint-disable-line max-len
    settings.percentages.forEach(function (point, index) {
      if (scrollRatio >= point) {
        settings.percentages.splice(index, 1);
        settings.dataLayer.push({
          event: settings.eventName,
          eventCategory: settings.eventCategory,
          eventAction: settings.percentageDepthAction,
          eventLabel: point,
          eventValue: null,
          nonInteraction: settings.nonInteraction
        });
      }
    });
  }

  /**
   * Push an event when the user has scrolled past each pixelDepthInterval
   * @return {void}
   */
  function pixelDepth() {
    var scrollTop = settings.scrollElement.scrollTop;
    while (scrollTop >= greatestScrollTop + settings.pixelDepthInterval) {
      greatestScrollTop += settings.pixelDepthInterval;
      settings.dataLayer.push({
        event: settings.eventName,
        eventCategory: settings.eventCategory,
        eventAction: settings.pixelDepthAction,
        eventLabel: greatestScrollTop + settings.pixelDepthInterval,
        eventValue: null,
        nonInteraction: settings.nonInteraction
      });
    }
  }

  /**
   * Return the event label
   * @param  {node} element
   * @return {string}
   */
  function formatElementLabel(element) {
    var label = element.localName;
    if (element.id) {
      label += '#' + element.id;
    }
    if (element.className) {
      label += '.' + element.className.replace(/ /g, '.');
    }

    return label;
  }

  /**
   * Push an event when the given element scrolls into view, if it exists
   * @return {void}
   */
  function elements() {
    settings.elements.forEach(function (element, index) {
      if (element && element.offsetTop + element.clientHeight < settings.scrollElement.clientHeight + settings.scrollElement.scrollTop) {
        settings.elements.splice(index, 1);
        settings.dataLayer.push({
          event: settings.eventName,
          eventCategory: settings.eventCategory,
          eventAction: settings.elementAction,
          eventLabel: formatElementLabel(element),
          eventValue: null,
          nonInteraction: settings.nonInteraction
        });
      }
    });
  }

  /**
   * Scroll watcher
   * @return {void}
   */
  function onScroll() {
    if (settings.percentages) {
      percentageDepth();
    }
    if (settings.pixelDepthInterval) {
      pixelDepth();
    }
    if (settings.elements.length) {
      elements();
    }
  }

  /**
   * Set scrollw atcher
   * @return {void}
   */
  function watch() {
    window.addEventListener('scroll', throttle(onScroll, settings.throttle), true);
  }

  if (settings.scrollElement.scrollHeight > settings.scrollElement.clientHeight && settings.scrollElement.scrollHeight > settings.minHeight) {
    watch();
  }
};

return index;

}());
