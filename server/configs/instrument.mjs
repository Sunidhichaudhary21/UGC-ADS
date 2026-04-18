import * as Sentry from "@sentry/node"


Sentry.init({
  dsn: "https://2d37cc516648bbe5f9d958557d9c3eff@o4511239434928128.ingest.de.sentry.io/4511239455768656",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});