"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.PageContext = void 0;

var _react = _interopRequireWildcard(require("react"));

var _withSiteTracking = require("./withSiteTracking");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var PageContext = _react["default"].createContext();

exports.PageContext = PageContext;

function PageWrapper(_ref) {
  var siteData = _ref.siteData,
      pageData = _ref.pageData,
      connectTo = _ref.connectTo,
      children = _ref.children;
  (0, _react.useEffect)(function () {
    if (typeof connectTo.trackPageLoad === "function") {
      connectTo.trackPageLoad({
        siteData: siteData,
        pageData: pageData
      });
    }
  }, [siteData, pageData, connectTo]);
  return children;
}

function withPageTracking(PageComponent, _ref2) {
  var pageData = _ref2.pageData;
  return function WithPageTracking(props) {
    return _react["default"].createElement(_withSiteTracking.SiteContext.Consumer, null, function (_ref3) {
      var siteData = _ref3.siteData,
          connectTo = _ref3.connectTo;
      return _react["default"].createElement(PageContext.Provider, {
        value: pageData
      }, _react["default"].createElement(PageWrapper, {
        siteData: siteData,
        pageData: pageData,
        connectTo: connectTo
      }, _react["default"].createElement(PageComponent, props)));
    });
  };
}

var _default = withPageTracking;
exports["default"] = _default;