import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { StoreContext } from '../routes/layout';
import { ID, account } from '../utils/AppWriteClient';
import { createProfile, getProfileByUserId } from '../utils/actions';
import { Loader } from './Loader';
import { ShowErrorObject } from './Login';
import { TextInput } from './TextInput';

export const Register = component$(() => {
  const appStore = useContext(StoreContext);
  const navigate = useNavigate();

  const loading = useSignal<boolean>(false);
  const name = useSignal<string | ''>('');
  const email = useSignal<string | ''>('');
  const password = useSignal<string | ''>('');
  const confirmPassword = useSignal<string | ''>('');
  const error = useSignal<ShowErrorObject | null>(null);

  const showError = (type: string) => {
    if (
      error &&
      Object.entries(error).length > 0 &&
      error.value &&
      error.value.type == type
    ) {
      return error.value.message;
    }
    return '';
  };

  const validate = $(() => {
    error.value = null;
    let isError = false;

    const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (!name.value) {
      error.value = { type: 'name', message: 'A Name is required' };
      isError = true;
    } else if (!email.value) {
      error.value = { type: 'email', message: 'An Email is required' };
      isError = true;
    } else if (!reg.test(email.value)) {
      error.value = { type: 'email', message: 'The Email is not valid' };
      isError = true;
    } else if (!password.value) {
      error.value = { type: 'password', message: 'A Password is required' };
      isError = true;
    } else if (password.value.length < 8) {
      error.value = {
        type: 'password',
        message: 'The Password needs to be longer',
      };
      isError = true;
    } else if (password.value != confirmPassword.value) {
      error.value = { type: 'password', message: 'The Passwords do not match' };
      isError = true;
    }
    return isError;
  });

  const register = $(async () => {
    const isError = await validate();
    if (isError) return;
    if (appStore.user) return;

    try {
      loading.value = true;

      try {
        const promise = await account.create(
          ID.unique(),
          email.value,
          password.value,
          name.value,
        );
        await account.createEmailSession(email.value, password.value);

        await createProfile(
          promise?.$id,
          name.value,
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
      loading.value = false;
      appStore.isLoginOpen = false;
      navigate('/', { forceReload: true });
    } catch (error) {
      console.log(error);
      loading.value = false;
      alert(error);
    }
  });

  return (
    <>
      <div>
        <h1 class="text-center text-[28px] mb-4 font-bold">Register</h1>

        <div class="px-6 pb-2">
          <TextInput
            string={name.value}
            placeholder="Name"
            onUpdate$={(value) => {
              name.value = value;
            }}
            inputType="text"
            error={showError('name')}
          />
        </div>

        <div class="px-6 pb-2">
          <TextInput
            string={email.value}
            placeholder="Email address"
            onUpdate$={(value) => {
              email.value = value;
            }}
            inputType="email"
            error={showError('email')}
          />
        </div>

        <div class="px-6 pb-2">
          <TextInput
            string={password.value}
            placeholder="Password"
            onUpdate$={(value) => {
              password.value = value;
            }}
            inputType="password"
            error={showError('password')}
          />
        </div>

        <div class="px-6 pb-2">
          <TextInput
            string={confirmPassword.value}
            placeholder="Confirm Password"
            onUpdate$={(value) => {
              confirmPassword.value = value;
            }}
            inputType="password"
            error={showError('confirmPassword')}
          />
        </div>

        <div class="px-6 pb-2 mt-6">
          <button
            disabled={loading.value}
            onClick$={() => register()}
            class={[
              'flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm',
              !name.value ||
              !email.value ||
              !password.value ||
              !confirmPassword.value
                ? 'bg-gray-200'
                : 'bg-[#F02C56]',
            ]}
          >
            {loading.value ? <Loader /> : 'Register'}
          </button>
        </div>
      </div>
    </>
  );
});
