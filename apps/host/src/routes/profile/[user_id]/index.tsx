import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { Image } from 'qwik-image';
import { PostUser } from '../../../components/PostUser';
import { PencilIcon } from '../../../components/icons/PencilIcon';
import { randomInt } from '../../../utils';
import {
  createBucketUrl,
  getPostsByUser,
  getProfileByUserId,
} from '../../../utils/actions';
import { StoreContext } from '../../layout';
import { IMAGE_PLACEHOLDER } from './../../../utils/constants';

export const useGetData = routeLoader$(async ({ params, redirect }) => {
  const profile = await getProfileByUserId(params.user_id);
  if (!profile.id) {
    throw redirect(307, '/');
  }

  const posts = await getPostsByUser(profile.userId);

  return { profile, posts };
});

export default component$(() => {
  const appStore = useContext(StoreContext);
  const data = useGetData();
  const profileImage = useComputed$(() =>
    createBucketUrl(data.value.profile.image),
  );

  return (
    <div class="pt-[90px] ml-[90px] 2xl:pl-[185px] lg:pl-[160px] lg:pr-0 w-[calc(100%-90px)] pr-3 max-w-[1800px] 2xl:mx-auto">
      <div class="flex w-[calc(100vw-230px)]">
        <Image
          class="w-[120px] min-w-[120px] rounded-full"
          layout="constrained"
          width={120}
          height={120}
          src={profileImage.value}
          placeholder={IMAGE_PLACEHOLDER}
        />

        <div class="ml-5 w-full">
          <div>
            <p class="text-[30px] font-bold truncate">
              {data.value.profile.name}
            </p>
            <p class="text-[18px] truncate">{data.value.profile.name}</p>
          </div>

          {appStore.user?.userId == data.value.profile.userId ? (
            <button
              onClick$={() => {
                appStore.isEditProfileOpen = true;
              }}
              class="flex item-center rounded-md py-1.5 px-3.5 mt-3 text-[15px] font-semibold border hover:bg-gray-100"
            >
              <PencilIcon />
              <span>Edit profile</span>
            </button>
          ) : (
            <button class="flex item-center rounded-md py-1.5 px-8 mt-3 text-[15px] text-white font-semibold bg-[#F02C56]">
              Follow
            </button>
          )}
        </div>
      </div>

      <div class="flex items-center pt-4">
        <div class="mr-4">
          <span class="font-bold">{randomInt(100, 400)}K</span>
          <span class="text-gray-500 font-light text-[15px] pl-1.5">
            Following
          </span>
        </div>
        <div class="mr-4">
          <span class="font-bold">{randomInt(100, 400)}K</span>
          <span class="text-gray-500 font-light text-[15px] pl-1.5">
            Followers
          </span>
        </div>
      </div>

      <p class="pt-4 mr-4 text-gray-500 font-light text-[15px] pl-1.5 max-w-[500px]">
        {data.value.profile.bio}
      </p>

      <ul class="w-full flex items-center pt-4 border-b">
        <li class="w-60 text-center py-2 text-[17px] font-semibold border-b-2 border-b-black">
          Videos
        </li>
        <li class="w-60 text-gray-500 text-center py-2 text-[17px] font-semibold">
          Liked
        </li>
      </ul>

      <div class="mt-4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
        {data.value.posts.map((post, index) => (
          <PostUser key={index} post={post} />
        ))}
      </div>

      <div class="pb-20" />
    </div>
  );
});
