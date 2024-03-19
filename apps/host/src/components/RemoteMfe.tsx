import {
  component$,
  SSRStream,
  SSRStreamBlock,
  StreamWriter,
} from '@builder.io/qwik';
import { TOKEN_COOKIE_KEY } from 'shared/constants';
import { type RemoteData } from '../../../../shared/remotes';
import { fixRemotePathsInDevMode } from '../../shared';

export interface Props {
  remote: RemoteData;
  removeLoader?: boolean;
  token?: string;
}

export default component$(
  ({ remote, removeLoader = false, token = '' }: Props) => {
    const url = remote.url;
    const decoder = new TextDecoder();
    const getSSRStreamFunction =
      (remoteUrl: string) => async (stream: StreamWriter) => {
        const _remoteUrl = new URL(remoteUrl);
        if (removeLoader) {
          _remoteUrl.searchParams.append('loader', 'false');
        }
        const reader = (
          await fetch(_remoteUrl, {
            headers: {
              accept: 'text/html',
              [TOKEN_COOKIE_KEY]: token,
            },
          })
        ).body!.getReader();
        let fragmentChunk = await reader.read();
        let base = '';
        while (!fragmentChunk.done) {
          const rawHtml = decoder.decode(fragmentChunk.value);
          const fixedHtmlObj = fixRemotePathsInDevMode(rawHtml, base);
          base = fixedHtmlObj.base;
          stream.write(fixedHtmlObj.html);
          fragmentChunk = await reader.read();
        }
      };

    return (
      <SSRStreamBlock>
        <SSRStream>{getSSRStreamFunction(url)}</SSRStream>
      </SSRStreamBlock>
    );
  },
);
