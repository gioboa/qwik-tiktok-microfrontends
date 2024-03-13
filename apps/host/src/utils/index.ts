import { Signal } from '@builder.io/qwik';
import { JWT_COOKIE_KEY } from './constants';
import { ShowErrorObject } from '../components/EditProfileOverlay';

export const setCookie = (value: string) => {
  const date = new Date();
  date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie =
    JWT_COOKIE_KEY + '=' + (value || '') + '; ' + expires + '; path=/';
};

export const showError = (
  type: string,
  errorSig: Signal<ShowErrorObject | null>,
) => {
  if (
    errorSig.value &&
    Object.entries(errorSig.value).length > 0 &&
    errorSig.value!.type === type
  ) {
    return errorSig.value.message;
  }
  return '';
};
