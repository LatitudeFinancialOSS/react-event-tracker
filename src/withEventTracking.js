import React from "react";
import { SiteContext } from "./withSiteTracking";
import { PageContext } from "./withPageTracking";

function withEventTracking(Component) {
  return function WithEventTracking(props) {
    return (
      <SiteContext.Consumer>
        {({ siteData, connectTo }) => (
          <PageContext.Consumer>
            {pageData => (
              <Component
                {...props}
                trackEvent={eventData => {
                  if (typeof connectTo.trackEvent === "function") {
                    connectTo.trackEvent({
                      siteData,
                      pageData,
                      eventData
                    });
                  }
                }}
                getQueryString={eventData => {
                  if (typeof connectTo.getQueryString === "function") {
                    return connectTo.getQueryString({
                      siteData,
                      pageData,
                      eventData
                    });
                  }

                  console.error(
                    `react-event-tracker: connected tracker doesn't expose getQueryString`
                  );
                  return "";
                }}
              />
            )}
          </PageContext.Consumer>
        )}
      </SiteContext.Consumer>
    );
  };
}

export default withEventTracking;
