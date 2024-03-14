import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { PostMain } from '../components/PostMain';
import { getAllPosts } from '../utils/actions';

export const useAllPost = routeLoader$(async () => {
  return await getAllPosts();
});

export default component$(() => {
  const allPosts = useAllPost();
  return (
    <div class="mt-[80px]  w-[calc(100%-90px)] max-w-[690px] ml-auto">
      {allPosts.value.map((post, index) => (
        <PostMain post={post} key={index} />
      ))}
    </div>
  );
});
