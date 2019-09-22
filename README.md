# react-event-tracker

## Installation

```shell
npm install --save react-event-tracker
```

## Supported trackers

- [Tealium](https://tealium.com) - See [tealium-tracker](https://github.com/moroshko/tealium-tracker)

## How to use

**App.js** - root level component

```js
import { withSiteTracking } from "react-event-tracker";

function App() {
  // Your root level component
}

// siteData can be any object
const siteData = {
  site: "my site"
};

// Basic tracker. See below for more options.
const myTracker = {
  trackEvent: ({ siteData, pageData, eventData }) => {
    // Do whatever you want with the data.
    // For example, call your analytics solution API.
  }
};

export default withSiteTracking(App, {
  siteData,
  connectTo: myTracker
});
```

**ProductPage.js** - page level component

```js
import { withPageTracking } from "react-event-tracker";

function ProductPage() {
  return (
    ...
    <AnotherComponent />
    ...
  );
}

// pageData can be any object
const pageData = {
  page: "my product"
};

export default withPageTracking(ProductPage, { pageData });
```

**AnotherComponent.js** - any component deep inside the tree

```js
import { withEventTracking } from "react-event-tracker";

// The `trackEvent` prop is injected by `withEventTracking`
function AnotherComponent({ trackEvent }) {
  return (
    ...
    <button
      onClick={() => {
        /*
          Here, the magic happens:

          We call `trackEvent` (provided by `react-event-tracker`) with `eventData`.

          In return, `react-event-tracker` calls our own `trackEvent` (provided by `myTracker` above) with `siteData`, `pageData`, and `eventData`.
        */
        trackEvent({ button: "Apply" });
      }}
    >
      Apply
    </button>
    ...
  )
}

export default withEventTracking(AnotherComponent);
```

## Automatic page load tracking

If you provide `trackPageLoad` to `myTracker`, `react-event-tracker` will call it once the page component renders.

```js
const myTracker = {
  trackPageLoad: ({ siteData, pageData }) => {
    // Do whatever you want with the data.
    // For example, call your analytics solution API.
  }
};
```

## Building a query string

When linking to external sites, you may want to add query string parameters based on `siteData`, `pageData`, and/or `eventData`.

Implement the `getQueryString` logic, pass it to `myTracker`, and then use it similarly to `trackEvent`:

```js
const myTracker = {
  getQueryString: ({ siteData, pageData, eventData }) => {
    // Build your query string here, e.g.: foo=1&bar=2
    // Don't forget to use encodeURIComponent on the values.
  }
};
```

```js
import { withEventTracking } from "react-event-tracker";

// The `getQueryString` prop is injected by `withEventTracking`
function AnotherComponent({ trackEvent }) {
  return (
    ...
    {/*
      Here, the magic happens:

      We call `getQueryString` (provided by `react-event-tracker`) with `eventData`.

      In return, `react-event-tracker` calls our own `getQueryString` (provided by `myTracker`) with `siteData`, `pageData`, and `eventData`.
    */}
    <a
      href={`https://external-site.com?${getQueryString({
        link: "apply"
      })}`}
    >
      Apply on external site
    </a>
    ...
  )
}

export default withEventTracking(AnotherComponent);
```
