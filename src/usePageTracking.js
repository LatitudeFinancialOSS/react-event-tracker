import { useEffect, useMemo, useCallback, useContext } from "react";
import { SiteTrackingContext } from "./useSiteTracking";

export default function usePageTracking(
  pageData,
  { trackPageViewByDefault = true } = {}
) {
  const {
    getSiteData,
    getPageTracking,
    getEventTracking,
    setPageData,
    getPageData,
  } = useContext(SiteTrackingContext);

  setPageData(pageData);

  const trackPageView = useCallback(() => {
    const pageTracking = getPageTracking();

    if (typeof pageTracking.trackPageView === "function") {
      pageTracking.trackPageView({
        siteData: getSiteData(),
        pageData: getPageData(),
      });
    } else {
      console.error(
        "react-event-tracker: pageTracking.trackPageView must be a function"
      );
    }
  }, [getPageTracking, getSiteData, getPageData]);

  useEffect(() => {
    if (trackPageViewByDefault === true) {
      trackPageView();
    }
  }, [trackPageViewByDefault, trackPageView]);

  const result = useMemo(() => {
    const eventTracking = getEventTracking();

    return Object.keys(eventTracking).reduce((acc, key) => {
      acc[key] = (eventData) => {
        if (typeof eventTracking[key] === "function") {
          const siteData = getSiteData();
          const pageData = getPageData();

          return eventTracking[key]({ siteData, pageData, eventData });
        }
      };
      return acc;
    }, {});
  }, [getSiteData, getEventTracking, getPageData]);

  return { ...result, trackPageView };
}
