import { useMemo, useContext } from "react";
import { PageTrackingContext } from "./usePageTracking";
import { SiteTrackingContext } from "./useSiteTracking";

export default function useEventTracking() {
  const { siteData, eventTracking } = useContext(SiteTrackingContext);
  const pageData = useContext(PageTrackingContext);
  const result = useMemo(() => {
    return Object.keys(eventTracking).reduce((acc, key) => {
      acc[key] = (eventData) => {
        if (typeof eventTracking[key] === "function") {
          return eventTracking[key]({ siteData, pageData, eventData });
        }
      };

      return acc;
    }, {});
  }, [siteData, pageData, eventTracking]);

  return result;
}
