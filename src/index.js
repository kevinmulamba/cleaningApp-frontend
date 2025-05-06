// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './utils/reportWebVitals';

// ✅ Sentry
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

// ✅ Mixpanel
import mixpanel from 'mixpanel-browser';

// ✅ Init Sentry
Sentry.init({
  dsn: "https://71419f0293f828f4a4c180ef7ef962330@4509084279504.ingest.de.sentry.io/4509084279504",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

// ✅ Init Mixpanel
mixpanel.init("71da2f9cb1109defa4cd4510a611b4f1", { debug: true });
mixpanel.track("App loaded");

// ✅ Démarrage de l'application React
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ✅ Web Vitals (perf tracking facultatif)
reportWebVitals();

