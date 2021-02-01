import { useEffect, useCallback, useContext } from "react";
import { SiteTrackingContext } from "./useSiteTracking";

export default function usePageTracking(
  pageData,
  { trackPageViewByDefault = true } = {}
) {
  const { getSiteData, getPageTracking, setPageData, getPageData } = useContext(
    SiteTrackingContext
  );

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

  return { trackPageView };
}
