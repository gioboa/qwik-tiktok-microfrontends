import { QRL, component$ } from '@builder.io/qwik';

export interface TextInputCompTypes {
  string: string;
  inputType: string;
  placeholder: string;
  onUpdate$: QRL<(newValue: string) => void>;
  error: string;
}

export const TextInput = component$(
  ({
    string,
    inputType,
    placeholder,
    error,
    onUpdate$,
  }: TextInputCompTypes) => {
    return (
      <>
        <input
          placeholder={placeholder}
          class="
                block
                w-full
                bg-[#F1F1F2]
                text-gray-800
                border
                border-gray-300
                rounded-md
                py-2.5
                px-3
                focus:outline-none
            "
          value={string || ''}
          onChange$={(_, target) => onUpdate$(target.value)}
          type={inputType}
          autoComplete="off"
        />

        <div class="text-red-500 text-[14px] font-semibold">
          {error ? error : null}
        </div>
      </>
    );
  },
);
