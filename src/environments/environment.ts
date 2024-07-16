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
  getRecords: '/test/list/{0}',
  /**Execute test */
  execute: '/test/execute/{0}',
  /**Stop test */
  stop: '/test/stop/{0}',
  /**Delete test */
  delete: '/test/delete/{0}',
  /**create folder */
  createFolder: '/folder/create',
  /**delete folder */
  deleteFolder: '/folder/delete/{0}',
  /**create folder */
  createTest: '/test/create',
  /**get test */
  getTest: '/test/{0}',
  /**create folder */
  updateTest: '/test/update',
  /**Record List */
  getExecutionRecords: '/test-execution/list/{0}',
  /**File List */
  getFileEvidences: '/evidence/{0}',
  /**login */
  login: '/auth/login',
  /**sing up */
  singup: '/auth/singup',
  /**get ports */
  getPorts: '/test-execution/ports/{0}',
  /**Confirm User */
  confirmUser: '/auth/confirm/{0}'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
