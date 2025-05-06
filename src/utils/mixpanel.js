import mixpanel from 'mixpanel-browser';

mixpanel.init('71da2f9cb1109defa4cd4510a611b4f1', {
  debug: true, // passe à false en production
});

export default mixpanel;

