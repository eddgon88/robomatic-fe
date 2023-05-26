// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  version: require('../../package.json').version,
  production: false
};

export const bff = {
  protocol: 'http://',
  host: 'localhost:8080/core/v1',

  /**Record List */
  getRecords: '/test/list/1/{0}',
  /**Execute test */
  execute: '/test/execute/{0}'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
