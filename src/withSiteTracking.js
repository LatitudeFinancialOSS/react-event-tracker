import React from "react";

export const SiteContext = React.createContext();

function withSiteTracking(Component, { siteData, connectTo }) {
  return function WithSiteTracking(props) {
    return (
      <SiteContext.Provider value={{ siteData, connectTo }}>
        <Component {...props} />
      </SiteContext.Provider>
    );
  };
}

export default withSiteTracking;
