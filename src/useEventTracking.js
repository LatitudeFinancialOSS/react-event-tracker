import { useMemo, useContext } from "react";
import { SiteTrackingContext } from "./useSiteTracking";

export default function useEventTracking() {
  const { getSiteData, getEventTracking, getPageData } =
    useContext(SiteTrackingContext);
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

  return result;
}
