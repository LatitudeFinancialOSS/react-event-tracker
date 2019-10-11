import React from "react";
import { SiteContext } from "./withSiteTracking";
import { PageContext } from "./withPageTracking";

function withEventTracking(Component, noContextInject) {
  return function WithEventTracking(props) {
    return (
      <SiteContext.Consumer>
        {data => {
          if (!data) {
            if (noContextInject) {
              return <Component {...props} {...noContextInject} />;
            }

            throw new Error(
              "You should wrap your root level component with `withSiteTracking`."
            );
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
