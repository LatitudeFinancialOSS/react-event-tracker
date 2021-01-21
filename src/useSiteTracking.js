import React, { createContext, useCallback } from "react";

export const SiteTrackingContext = createContext();

export default function useSiteTracking(trackingConfig) {
  const SiteTracking = useCallback(
    ({ children }) => {
      return (
        <SiteTrackingContext.Provider value={trackingConfig}>
          {children}
        </SiteTrackingContext.Provider>
      );
    },
    [trackingConfig]
  );

  return {
    SiteTracking,
  };
}
