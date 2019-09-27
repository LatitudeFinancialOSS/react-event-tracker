import React from "react";

export const SiteContext = React.createContext();

export const WithSiteTracking = ({
  siteData,
  inject,
  onPageLoad,
  children
}) => (
  <SiteContext.Provider value={{ siteData, inject, onPageLoad }}>
    {children}
  </SiteContext.Provider>
);

function withSiteTracking(Component, { siteData, inject, onPageLoad }) {
  return function WithSiteTracking(props) {
    return (
      <SiteContext.Provider value={{ siteData, inject, onPageLoad }}>
        <Component {...props} />
      </SiteContext.Provider>
    );
  };
}

export default withSiteTracking;
