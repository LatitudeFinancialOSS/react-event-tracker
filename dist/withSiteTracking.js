"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.SiteContext = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var SiteContext = _react["default"].createContext();

exports.SiteContext = SiteContext;

function withSiteTracking(Component, _ref) {
  var siteData = _ref.siteData,
      connectTo = _ref.connectTo;
  return function WithSiteTracking(props) {
    return _react["default"].createElement(SiteContext.Provider, {
      value: {
        siteData: siteData,
        connectTo: connectTo
      }
    }, _react["default"].createElement(Component, props));
  };
}

var _default = withSiteTracking;
exports["default"] = _default;