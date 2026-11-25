const PREFIX = "nexus";

export enum StorageKey {
  SIDEBAR_STATE = `${PREFIX}:sidebar-state`,

  ACCESS_TOKEN = `${PREFIX}:access-token`,
  SESSION_ID = `${PREFIX}:session-id`,
  USER_ID = `${PREFIX}:user-id`,
  USER_ACCESS = `${PREFIX}:user-access`,
  REMEMBER_LOGIN = `${PREFIX}:remember-login`,

  PUBLIC_ACCESS_TOKEN = `${PREFIX}:public-access-token`,
  PUBLIC_USER_ACCESS = `${PREFIX}:public-user-access`,
  PUBLIC_USER_DATA = `${PREFIX}:public-user-client`,
  PUBLIC_ACCESS_PARAMS = `${PREFIX}:public-access-params`,

  THEME_STORAGE_KEY = `${PREFIX}:tenant-theme`,
}
