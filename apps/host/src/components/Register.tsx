import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { StoreContext } from '../routes/layout';
import { showError } from '../utils';
import { ID, account } from '../utils/AppWriteClient';
import { createProfile, getProfileByUserId } from '../utils/actions';
import { ShowErrorObject } from './Login';
import { TextInput } from './TextInput';
import { LoaderIcon } from '@qwik-tiktok-microfrontends/ui';

export const Register = component$(() => {
  const appStore = useContext(StoreContext);
  const navigate = useNavigate();
  const loadingSig = useSignal<boolean>(false);
  const nameSig = useSignal<string | ''>('');
  const emailSig = useSignal<string | ''>('');
  const passwordSig = useSignal<string | ''>('');
  const confirmPasswordSig = useSignal<string | ''>('');
  const errorSig = useSignal<ShowErrorObject | null>(null);

  const validate = $(() => {
    errorSig.value = null;
    let isError = false;

    const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!nameSig.value) {
      errorSig.value = { type: 'name', message: 'A Name is required' };
      isError = true;
    } else if (!emailSig.value) {
      errorSig.value = { type: 'email', message: 'An Email is required' };
      isError = true;
    } else if (!reg.test(emailSig.value)) {
      errorSig.value = { type: 'email', message: 'The Email is not valid' };
      isError = true;
    } else if (!passwordSig.value) {
      errorSig.value = { type: 'password', message: 'A Password is required' };
      isError = true;
    } else if (passwordSig.value.length < 8) {
      errorSig.value = {
        type: 'password',
        message: 'The Password needs to be longer',
      };
      isError = true;
    } else if (passwordSig.value != confirmPasswordSig.value) {
      errorSig.value = {
        type: 'password',
        message: 'The Passwords do not match',
      };
      isError = true;
    }
    return isError;
  });

  const register = $(async () => {
    const isError = await validate();
    if (isError) return;
    if (appStore.user) return;

    try {
      loadingSig.value = true;

      try {
        const promise = await account.create(
          ID.unique(),
          emailSig.value,
          passwordSig.value,
          nameSig.value,
        );
        await account.createEmailSession(emailSig.value, passwordSig.value);

        await createProfile(
          promise?.$id,
          nameSig.value,
          String(import.meta.env.VITE_PLACEHOLDER_DEFAULT_IMAGE_ID),
          '',
        );

        try {
          const currentSession = await account.getSession('current');
          if (!currentSession) return;

          const response = await account.get();
          const profile = await getProfileByUserId(response?.$id);

          appStore.user = { ...profile };
        } catch (error) {
          appStore.user = undefined;
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
      loadingSig.value = false;
      appStore.isLoginOpen = false;
      navigate('/', { forceReload: true });
    } catch (error) {
      console.log(error);
      loadingSig.value = false;
      alert(error);
    }
  });

  return (
    <>
      <div>
        <h1 class="text-center text-[28px] mb-4 font-bold">Register</h1>

        <div class="px-6 pb-2">
          <TextInput
            string={nameSig.value}
            placeholder="Name"
            onUpdate$={(value) => {
              nameSig.value = value;
            }}
            inputType="text"
            error={showError('name', errorSig)}
          />
        </div>

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

        <div class="px-6 pb-2">
          <TextInput
            string={confirmPasswordSig.value}
            placeholder="Confirm Password"
            onUpdate$={(value) => {
              confirmPasswordSig.value = value;
            }}
            inputType="password"
            error={showError('confirmPassword', errorSig)}
          />
        </div>

        <div class="px-6 pb-2 mt-6">
          <button
            disabled={loadingSig.value}
            onClick$={() => register()}
            class={[
              'flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm',
              !nameSig.value ||
              !emailSig.value ||
              !passwordSig.value ||
              !confirmPasswordSig.value
                ? 'bg-gray-200'
                : 'bg-[#F02C56]',
            ]}
          >
            {loadingSig.value ? <LoaderIcon /> : 'Register'}
          </button>
        </div>
      </div>
    </>
  );
});
