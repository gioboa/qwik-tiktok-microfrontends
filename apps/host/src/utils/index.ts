import { JWT_COOKIE_KEY } from './constants';

export const setCookie = (value: string) => {
  const date = new Date();
  date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie =
    JWT_COOKIE_KEY + '=' + (value || '') + '; ' + expires + '; path=/';
};
