import { TOKENS_KEY } from "constants/config";

export const getLocalRefreshToken = () => {
  const tokenData = JSON.parse(localStorage.getItem(TOKENS_KEY));
  return tokenData?.refresh_token;
};

export const getLocalAccessToken = () => {
  const tokenData = JSON.parse(localStorage.getItem(TOKENS_KEY));
  return tokenData?.access_token;
};

export const getTokens = () => {
  const tokenData = JSON.parse(localStorage.getItem(TOKENS_KEY));
  return tokenData;
};

export const setTokens = (tokens) => {
  localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
};

export const removeTokens = () => {
    localStorage.removeItem(TOKENS_KEY);

}
