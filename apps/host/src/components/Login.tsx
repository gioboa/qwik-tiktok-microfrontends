import { $, component$, useSignal } from '@builder.io/qwik';
import { LoaderIcon } from '@qwik-tiktok-microfrontends/ui';
import { setCookie, showError } from '../utils';
import { account } from '../utils/AppWriteClient';
import { TextInput } from './TextInput';

export interface ShowErrorObject {
  type: string;
  message: string;
}

export const Login = component$(() => {
  const loadingSig = useSignal<boolean>(false);
  const emailSig = useSignal<string | ''>('');
  const passwordSig = useSignal<string | ''>('');
  const errorSig = useSignal<ShowErrorObject | null>(null);

  const validate = $(() => {
    errorSig.value = null;
    let isError = false;

    if (!emailSig.value) {
      errorSig.value = { type: 'email', message: 'An Email is required' };
      isError = true;
    } else if (!passwordSig.value) {
      errorSig.value = { type: 'password', message: 'A Password is required' };
      isError = true;
    }
    return isError;
  });

  const login = $(async () => {
    const isError = await validate();
    if (isError) return;

    try {
      loadingSig.value = true;

      await account.createEmailSession(emailSig.value, passwordSig.value);

      const token = await account.createJWT();
      setCookie(token.jwt);

      location.reload();
    } catch (error) {
      console.log(error);
      loadingSig.value = false;
      alert(error);
    }
  });

  return (
    <>
      <div>
        <h1 class="text-center text-[28px] mb-4 font-bold">Log in</h1>

        <div class="px-6 pb-2">
          <TextInput
            string={emailSig.value}
            placeholder="Email address"
            onUpdate$={(value) => {
              emailSig.value = value;
            }}
            inputType="email"
            error={showError('email', errorSig)}
          />
        </div>

        <div class="px-6 pb-2">
          <TextInput
            string={passwordSig.value}
            placeholder="Password"
            onUpdate$={(value) => {
              passwordSig.value = value;
            }}
            inputType="password"
            error={showError('password', errorSig)}
          />
        </div>

        <div class="px-6 pb-2 mt-6">
          <button
            disabled={loadingSig.value}
            onClick$={() => login()}
            class={[
              'flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm',
              !emailSig || !passwordSig ? 'bg-gray-200' : 'bg-[#F02C56]',
            ]}
          >
            {loadingSig.value ? <LoaderIcon /> : 'Log in'}
          </button>
        </div>
      </div>
    </>
  );
});
