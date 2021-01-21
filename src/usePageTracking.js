import React, {
  createContext,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from "react";
import { SiteTrackingContext } from "./useSiteTracking";

export const PageTrackingContext = createContext();

export default function usePageTracking(pageData) {
  const { siteData, pageTracking } = useContext(SiteTrackingContext);
  const data = {
    siteData,
    pageData,
    pageTracking,
  };
  const dataRef = useRef(data);
  const PageTracking = useCallback(
    ({ children }) => {
      return (
        <PageTrackingContext.Provider value={pageData}>
          {children}
        </PageTrackingContext.Provider>
      );
    },
    [pageData]
  );

  useEffect(() => {
    dataRef.current = data;
  });

  useEffect(() => {
    const { siteData, pageData, pageTracking } = dataRef.current;

    if (typeof pageTracking.onPageLoad === "function") {
      pageTracking.onPageLoad({ siteData, pageData });
    }
  }, []);

  return {
    PageTracking,
  };
}
