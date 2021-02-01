# react-event-tracker

## Install

```shell
npm install --save react-event-tracker
```

## How to use

**App.js** - root level component

```js
import { useSiteTracking } from "react-event-tracker";

const trackingConfig = {
  siteData: {
    site: "my site",
  },
  pageTracking: {
    trackPageView: ({ siteData, pageData }) => {
      // Fire a page view to your analytics solution.
    },
  },
  eventTracking: {
    trackEvent: ({ siteData, pageData, eventData }) => {
      // Fire a click event to your analytics solution.
    },
  },
};

function App() {
  const { SiteTracking } = useSiteTracking(trackingConfig);

  // Wrap your app with SiteTracking
  return <SiteTracking>...</SiteTracking>;
}
```

**ProductPage.js** - page level component

```js
import { usePageTracking } from "react-event-tracker";

// To automatically fire a page view, just pass the `pageData` to `usePageTracking`. This will call your `trackingConfig.pageTracking.trackPageView` once the page mounts.
function ProductPage() {
  usePageTracking({
    page: "my_product",
  });

  ...
}

// If you don't want to fire the page view immediately after the page gets mounted, you can fire it yourself based on any logic you want.
function ProductPage(props) {
  const [products, setProducts] = useState();
  const { trackPageView } = usePageTracking({
    page: "my_product",
    products // will be fetched from the server
  }, {
    trackPageViewByDefault: false
  });

  useEffect(() => {
    if (products) {
      trackPageView();
    }
  }, [products, trackPageView]); // react-event-tracker guarantees that trackPageView will never change

  ...
}
```

**Note:** Make sure that you never render more than one page level component at a given time.

**Content.js** - any component deep inside the tree

```js
import { useEventTracking } from "react-event-tracker";

function Content() {
  const { trackEvent } = useEventTracking();

  return (
    ...
    <button
      onClick={() => {
        /*
          Here is the core of what this library does.

          You call `trackEvent` (provided by `react-event-tracker`) with `eventData`.

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
```

## Writing to `localStorage`

Sometimes, when tracking a page view, you may want to track the traffic source.

For example, say you are tracking page views of the Application page. It could be very useful to know how users have arrived to the Application page. Did they click the "Apply" link in the header on the Home page? Maybe the "Apply" link in the footer? Or, maybe, they landed on the Application page after clicking "Apply" on your Product Page?

One way to track this, is to write to `localStorage` when users click the "Apply" link. Then, read from `localStorage` in the `trackPageView` function.

```js
const trackingConfig = {
  ...
  eventTracking: {
    storeTrafficSource: ({ pageData, eventData }) => {
      localStorage.setItem(
        "traffic_source",
        `${pageData.page}:${eventData.source}`
      );
    }
  }
};
```

```js
import { useEventTracking } from "react-event-tracker";

function Content() {
  const { storeTrafficSource } = useEventTracking();

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
```

## Building a query string

When linking to external sites, you may want to add query string parameters based on `siteData`, `pageData`, and/or `eventData`.

Add a `getQueryString` function to `eventTracking`, e.g.:

```js
const trackingConfig = {
  eventTracking: {
    getQueryString: ({ siteData, pageData, eventData }) => {
      const dataLayer = {
        ...siteData,
        ...pageData,
        ...eventData,
      };

      return Object.keys(dataLayer)
        .map((key) => `${key}=${encodeURIComponent(dataLayer[key])}`)
        .join("&");
    },
  },
};
```

Then, call `getQueryString` that is given to you by `useEventTracking`.

```js
import { useEventTracking } from "react-event-tracker";

function Content() {
  const { getQueryString } = useEventTracking();

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
```

## Related

- [tealium-tracker](https://github.com/moroshko/tealium-tracker) - Easily integrate with [Tealium](https://tealium.com)
