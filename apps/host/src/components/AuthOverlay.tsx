import { component$, useContext, useSignal } from '@builder.io/qwik';
import { StoreContext } from '../routes/layout';
import { AiOutlineClose } from './AiOutlineClose';
import { Login } from './Login';
import { Register } from './Register';

export const AuthOverlay = component$(() => {
  const appStore = useContext(StoreContext);
  const registerSig = useSignal(false);
  // let { setIsLoginOpen } = useGeneralStore()

  // let [isRegister, setIsRegister] = useState<boolean>(false)

  return (
    <>
      <div
        id="AuthOverlay"
        class="fixed flex items-center justify-center z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50"
      >
        <div class="relative bg-white w-full max-w-[470px] h-[70%] p-4 rounded-lg">
          <div class="w-full flex justify-end">
            <button
              onClick$={() => (appStore.isLoginOpen = false)}
              class="p-1.5 rounded-full bg-gray-100"
            >
              <AiOutlineClose />
            </button>
          </div>

          {registerSig.value ? <Register /> : <Login />}

          <div class="absolute flex items-center justify-center py-5 left-0 bottom-0 border-t w-full">
            <span class="text-[14px] text-gray-600">
              Don't have an account?
            </span>

            <button
              onClick$={() => (registerSig.value = !registerSig.value)}
              class="text-[14px] text-[#F02C56] font-semibold pl-1"
            >
              <span>{!registerSig.value ? 'Register' : 'log in'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
});
