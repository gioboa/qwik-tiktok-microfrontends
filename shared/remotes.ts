export interface RemoteData {
  name: string;
  url: string;
}

export const remotes: Record<string, RemoteData> = {
  upload: { name: 'upload', url: 'http://localhost:5174/upload/' },
};
