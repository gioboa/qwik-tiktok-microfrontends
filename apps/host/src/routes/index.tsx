import { $, component$, useOnDocument, useSignal } from '@builder.io/qwik';
import { CART_QUANTITIES_CHANGED_EVENT } from 'shared/constants';

export default component$(() => {
  const cartQtySignal = useSignal(0);

  useOnDocument(
    CART_QUANTITIES_CHANGED_EVENT,
    $((event) => {
      console.log('CART_QUANTITIES_CHANGED_EVENT');
      cartQtySignal.value += (event as CustomEvent).detail.qty;
    }),
  );

  return (
    <>
      host
      {/* <div class="flex mt-12" style="justify-content: flex-end">
        <CartCounter count={cartQtySignal.value} />
      </div>
      <RemoteMfe remote={remotes.home} removeLoader={true} /> */}
    </>
  );
});
