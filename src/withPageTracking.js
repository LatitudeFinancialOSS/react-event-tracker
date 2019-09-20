import React, { useEffect } from "react";
import { SiteContext } from "./withSiteTracking";

export const PageContext = React.createContext();

function PageWrapper({ siteData, pageData, connectTo, children }) {
  useEffect(() => {
    if (typeof connectTo.trackPageLoad === "function") {
      connectTo.trackPageLoad({ siteData, pageData });
    }
  }, [siteData, pageData, connectTo]);

  return children;
}

function withPageTracking(PageComponent, { pageData }) {
  return function WithPageTracking(props) {
    return (
      <SiteContext.Consumer>
        {({ siteData, connectTo }) => (
          <PageContext.Provider value={pageData}>
            <PageWrapper
              siteData={siteData}
              pageData={pageData}
              connectTo={connectTo}
            >
              <PageComponent {...props} />
            </PageWrapper>
          </PageContext.Provider>
        )}
      </SiteContext.Consumer>
    );
  };
}

export default withPageTracking;
