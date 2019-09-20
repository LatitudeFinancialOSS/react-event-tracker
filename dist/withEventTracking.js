"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _withSiteTracking = require("./withSiteTracking");

var _withPageTracking = require("./withPageTracking");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function withEventTracking(Component) {
  return function WithEventTracking(props) {
    return _react["default"].createElement(_withSiteTracking.SiteContext.Consumer, null, function (_ref) {
      var siteData = _ref.siteData,
          connectTo = _ref.connectTo;
      return _react["default"].createElement(_withPageTracking.PageContext.Consumer, null, function (pageData) {
        return _react["default"].createElement(Component, _extends({}, props, {
          trackEvent: function trackEvent(eventData) {
            if (typeof connectTo.trackEvent === "function") {
              connectTo.trackEvent({
                siteData: siteData,
                pageData: pageData,
                eventData: eventData
              });
            }
          },
          getQueryString: function getQueryString(eventData) {
            if (typeof connectTo.getQueryString === "function") {
              return connectTo.getQueryString({
                siteData: siteData,
                pageData: pageData,
                eventData: eventData
              });
            }

            console.error("react-event-tracker: connected tracker doesn't expose getQueryString");
            return "";
          }
        }));
      });
    });
  };
}

var _default = withEventTracking;
exports["default"] = _default;