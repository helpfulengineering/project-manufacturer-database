import posthog from "posthog-js";
import {POSTHOG_API_HOST, POSTHOG_TOKEN} from "./config";

const isProduction = () => window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";

export const initAnalytics = () => {
  if (isProduction()) {
    posthog.init(POSTHOG_TOKEN, {api_host: POSTHOG_API_HOST});
  } else {
    console.log('analytics disabled for localhost');
  }
};

export const trackEvent = (name, metadata) => {
  // https://docs.posthog.com/#/integrations/js-integration?id=sending-events
  // posthog.capture('[event-name]', {property1: 'value', property2: 'another value'});
  if (isProduction()) {
    posthog.capture(name, metadata);
  } else {
    console.log(`stub: tracking event ${name} with metadata ${JSON.stringify(metadata)}`);
  }
};
