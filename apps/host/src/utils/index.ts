import { Signal } from '@builder.io/qwik';
import { TOKEN_COOKIE_KEY } from 'shared/constants';
import { ShowErrorObject } from '../components/EditProfileOverlay';

export const setCookie = (value: string) => {
  const date = new Date();
  date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie =
    TOKEN_COOKIE_KEY + '=' + (value || '') + '; ' + expires + '; path=/';
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

export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
