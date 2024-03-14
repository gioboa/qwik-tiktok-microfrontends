import { component$ } from '@builder.io/qwik';

type Props = {
  class?: string;
  color?: string;
  size?: string;
};

export const LoaderIcon = component$<Props>(
  ({ class: _class, color, size }) => {
    return (
      <svg
        stroke={color || 'currentColor'}
        fill={color || 'currentColor'}
        stroke-width="0"
        viewBox="0 0 24 24"
        class={_class || 'animate-spin'}
        color={color || '#ffffff'}
        height={size || '25'}
        width={size || '25'}
        xmlns="http://www.w3.org/2000/svg"
        style="color: rgb(255, 255, 255);"
      >
        <circle cx="12" cy="20" r="2"></circle>
        <circle cx="12" cy="4" r="2"></circle>
        <circle cx="6.343" cy="17.657" r="2"></circle>
        <circle cx="17.657" cy="6.343" r="2"></circle>
        <circle cx="4" cy="12" r="2.001"></circle>
        <circle cx="20" cy="12" r="2"></circle>
        <circle cx="6.343" cy="6.344" r="2"></circle>
        <circle cx="17.657" cy="17.658" r="2"></circle>
      </svg>
    );
  },
);
