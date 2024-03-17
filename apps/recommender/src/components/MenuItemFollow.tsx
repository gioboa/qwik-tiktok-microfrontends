import { component$ } from '@builder.io/qwik';
import { OutlineCheckCircleIcon } from '@qwik-tiktok-microfrontends/ui';
import { Image } from 'qwik-image';
import { createBucketUrl } from '../utils/actions';

export type Props = {
  user: RandomUser;
};

export type RandomUser = {
  userId: string;
  name: string;
  image: string;
};

export const MenuItemFollow = component$<Props>(({ user }) => {
  return (
    <>
      <a
        href={`/profile/${user?.userId}`}
        class="flex items-center hover:bg-gray-100 rounded-md w-full py-1.5 px-2"
      >
        <Image
          class="rounded-full lg:mx-0 mx-auto"
          width="35"
          height="35"
          layout="constrained"
          src={createBucketUrl(user?.image)}
        />
        <div class="lg:pl-2.5 lg:block hidden">
          <div class="flex items-center">
            <p class="font-bold text-[14px] truncate">{user?.name}</p>
            <p class="ml-1 rounded-full bg-[#58D5EC] h-[16px] relative">
              <OutlineCheckCircleIcon
                class="relative p-[3px]"
                color="#FFFFFF"
              />
            </p>
          </div>
          <p class="font-light text-[12px] text-gray-600">{user?.name}</p>
        </div>
      </a>
    </>
  );
});
