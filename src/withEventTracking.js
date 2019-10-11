import React from "react";
import { SiteContext } from "./withSiteTracking";
import { PageContext } from "./withPageTracking";

function withEventTracking(Component, noContextInject) {
  return function WithEventTracking(props) {
    return (
      <SiteContext.Consumer>
        {data => {
          if (!data) {
            return <Component {...props} {...noContextInject} />;
          }

          const { siteData, inject = {} } = data;

          return (
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
          );
        }}
      </SiteContext.Consumer>
    );
  };
}

export default withEventTracking;
