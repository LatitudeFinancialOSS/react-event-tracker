import React from "react";
import { SiteContext } from "./withSiteTracking";
import { PageContext } from "./withPageTracking";

function withEventTracking(Component) {
  return function WithEventTracking(props) {
    return (
      <SiteContext.Consumer>
        {({ siteData, inject }) => (
          <PageContext.Consumer>
            {pageData => (
              <Component
                {...props}
                {...Object.keys(inject).reduce((acc, prop) => {
                  acc[prop] = eventData => {
                    return inject[prop]({ siteData, pageData, eventData });
                  };
                  return acc;
                }, {})}
              />
            )}
          </PageContext.Consumer>
        )}
      </SiteContext.Consumer>
    );
  };
}

export default withEventTracking;
