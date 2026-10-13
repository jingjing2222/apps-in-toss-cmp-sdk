import { defineConfig } from '@apps-in-toss/web-framework/config';
export default defineConfig({
  appName: 'cmp-service-sample',
  brand: { primaryColor: '#3469D9' },
  permissions: [],
  navigationBar: { withBackButton: true, withHomeButton: true, theme: 'light' },
  webBundleDir: 'dist/apps-in-toss'
});
