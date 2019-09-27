import React, { useEffect } from "react";
import { SiteContext } from "./withSiteTracking";

export const PageContext = React.createContext();

function PageWrapper({ siteData, pageData, onPageLoad, children }) {
  useEffect(() => {
    if (typeof onPageLoad === "function") {
      onPageLoad({ siteData, pageData });
    }
  }, [siteData, pageData, onPageLoad]);

  return children;
}

function withPageTracking(PageComponent, { pageData }) {
  return function WithPageTracking(props) {
    return (
      <SiteContext.Consumer>
        {({ siteData, onPageLoad }) => (
          <PageContext.Provider value={pageData}>
            <PageWrapper
              siteData={siteData}
              pageData={pageData}
              onPageLoad={onPageLoad}
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
