export const TOKEN_KEY = "@ivh-Token";
export const USER_UUID = "@ivh-user-uuid";
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUUID = () => localStorage.getItem(USER_UUID);
export const login = (token, uuid) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_UUID, uuid);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_UUID);
};