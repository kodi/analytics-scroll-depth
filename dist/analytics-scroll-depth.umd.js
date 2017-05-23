/*!
 * Analytics Scroll Depth v0.0.1
 * (c) 2017 Nick Mickley
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.AnalyticsScrollDepth = factory());
}(this, (function () { 'use strict';

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
    elements: [], // @TODO
    dataLayer: window.dataLayer, // @TODO set up nonDataLayer tracking
    eventName: 'CustomEvent',
    eventCategory: 'Scroll Depth',
    percentageDepthAction: 'Percentage Depth',
    pixelDepthAction: 'Pixel Depth',
    elementAction: 'Element Depth',
    nonInteraction: true }, settings);

  var greatestScrollTop = 0;

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

  function elements() {
    settings.elements.forEach(function (element, index) {
      if (element.offsetTop + element.clientHeight < settings.scrollElement.clientHeight + settings.scrollElement.scrollTop) {
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

  function watch() {
    window.addEventListener('scroll', throttle(onScroll, settings.throttle), true);
  }

  if (settings.scrollElement.scrollHeight > settings.scrollElement.clientHeight && settings.scrollElement.scrollHeight > settings.minHeight) {
    watch();
  }
};

return index;

})));
