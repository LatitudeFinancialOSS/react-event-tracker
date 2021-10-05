import React, {
  createContext,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useContext,
} from "react";

export const SiteTrackingContext = createContext();

export default function useSiteTracking(trackingConfig) {
  const trackingConfigRef = useRef(trackingConfig);
  const pageDataRef = useRef();

  useEffect(() => {
    trackingConfigRef.current = trackingConfig;
  });

  const providerValue = useMemo(() => {
    return {
      getSiteData: () => {
        return trackingConfigRef.current.siteData;
      },
      setSiteData: (siteData) => {
        trackingConfigRef.current.siteData = siteData;
      },
      getPageTracking: () => {
        return trackingConfigRef.current.pageTracking;
      },
      getEventTracking: () => {
        return trackingConfigRef.current.eventTracking;
      },
      setPageData: (pageData) => {
        pageDataRef.current = pageData;
      },
      getPageData: () => {
        return pageDataRef.current;
      },
    };
  }, []);

  const SiteTracking = useCallback(
    ({ children }) => {
      return (
        <SiteTrackingContext.Provider value={providerValue}>
          {children}
        </SiteTrackingContext.Provider>
      );
    },
    [providerValue]
  );

  return {
    SiteTracking,
  };
}

export function useSiteData() {
  return useContext(SiteTrackingContext)
}
