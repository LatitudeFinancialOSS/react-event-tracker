# react-event-tracker

## Install

```shell
npm install --save react-event-tracker
```

## How to use

**App.js** - root level component

```js
import { withSiteTracking } from "react-event-tracker";

function App() {
  // Your root level component
}

const trackingConfig = {
  // `siteData` can be anything
  siteData: {
    site: "my site"
  },
  // Omit `inject` if server-rendering
  inject: {
    // `trackEvent` will be injected as a prop.
    // You can choose any prop name.
    trackEvent: ({ siteData, pageData, eventData }) => {
      // Do whatever you want with the data.
      // For example, call your analytics API.
    }
  }
};

export default withSiteTracking(App, trackingConfig);
```

or, you can wrap your root level component with `WithSiteTracking`:

```js
import { WithSiteTracking } from "react-event-tracker";

function App() {
  return (
    <WithSiteTracking {...trackingConfig}>
      {/* Your root level component */}
    </WithSiteTracking>
  );
}
```

**ProductPage.js** - page level component

```js
import { withPageTracking } from "react-event-tracker";

function ProductPage() {
  return (
    ...
    <ProductPageContent />
    ...
  );
}

// `pageData` can be anything
const pageData = {
  page: "my_product"
};

export default withPageTracking(ProductPage, { pageData });
```

**ProductPageContent.js** - any component deep inside the tree

```js
import { withEventTracking } from "react-event-tracker";

// The `trackEvent` prop is injected by `withEventTracking` according to the `trackingConfig` above.
function ProductPageContent({ trackEvent }) {
  return (
    ...
    <button
      onClick={() => {
        /*
          Here is the core of what this library does.

          You call `trackEvent` (provided by `react-event-tracker`) with `eventData` (can be anything).

          In return, `react-event-tracker` will call your own `trackEvent` (that you defined in the `trackingConfig` above) with `siteData`, `pageData`, and `eventData`.
        */
        trackEvent({ button: "Apply" });
      }}
    >
      Apply
    </button>
    ...
  )
}

export default withEventTracking(ProductPageContent);
```

## Tracking page views

Add an `onPageLoad` function to the `trackingConfig`:

```js
const trackingConfig = {
  onPageLoad: ({ siteData, pageData, eventData }) => {
      // Do whatever you want with the data.
      // For example, call your analytics API.
    }
  }
};
```

`react-event-tracker` will call the `onPageLoad` function once your pages (i.e. components wrapped with `withPageTracking`) finish rendering.

You could, for example, inspect cookies or `localStorage` here, build your data layer, and then call your analytics API.

## Writing to `localStorage`

Sometimes, when tracking a page view, you may want to track the traffic source.

For example, say you are tracking page views of the Application page. It could be very useful to know how users have arrived to the Aplication page. Did they click the "Apply" link in the header on the Home page? Maybe the "Apply" link in the footer? Or, maybe, they landed on the Application page after clicking "Apply" on your Product Page?

One way to track this, is to write to `localStorage` when users click the "Apply" link. Then, read from `localStorage` in the `onPageLoad` function.

```js
const trackingConfig = {
  storeTrafficSource: ({ pageData, eventData }) => {
    localStorage.setItem(
      "traffic_source",
      `${pageData.page}:${eventData.source}`
    );
  }
};
```

```js
import { withEventTracking } from "react-event-tracker";

// The `storeTrafficSource` prop is injected by `withEventTracking` according to the `trackingConfig` above.
function ProductPageContent({ storeTrafficSource }) {
  return (
    ...
    {/*
      You call `storeTrafficSource` (provided by `react-event-tracker`) with `eventData`.

      In return, `react-event-tracker` will call your own `storeTrafficSource` (that you defined in the `trackingConfig` above) with `siteData`, `pageData`, and `eventData`.
    */}
    <a
      href="/apply"
      onClick={() => {
        // This will write "my_product:apply" to "traffic_source" in `localStorage`.
        storeTrafficSource({ source: "apply" });
      }}
    >
      Apply
    </a>
    ...
  )
}

export default withEventTracking(ProductPageContent);
```

## Building a query string

When linking to external sites, you may want to add query string parameters based on `siteData`, `pageData`, and/or `eventData`.

Add a `getQueryString` function to `inject`, e.g.:

```js
const trackingConfig = {
  inject: {
    getQueryString: ({ siteData, pageData, eventData }) => {
      const dataLayer = {
        ...siteData,
        ...pageData,
        ...eventData
      };

      return Object.keys(dataLayer)
        .map(key => `${key}=${encodeURIComponent(dataLayer[key])}`)
        .join("&");
    }
  }
};
```

Then, call `getQueryString` that is injected as a prop:

```js
import { withEventTracking } from "react-event-tracker";

// The `getQueryString` prop is injected by `withEventTracking` according to the `trackingConfig` above.
function ProductPageContent({ getQueryString }) {
  return (
    ...
    {/*
      You call `getQueryString` (provided by `react-event-tracker`) with `eventData`.

      In return, `react-event-tracker` will call your own `getQueryString` (that you defined in the `trackingConfig` above) with `siteData`, `pageData`, and `eventData`.
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

export default withEventTracking(ProductPageContent);
```

## Related

- [tealium-tracker](https://github.com/moroshko/tealium-tracker) - Easily integrate with [Tealium](https://tealium.com)
