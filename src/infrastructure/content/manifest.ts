export type ManifestEntry = {
  id: string;
  key: string;
  url?: string;
  hash: string;
  updatedAt: string;
};
export type Manifest = { generatedAt: string; entries: ManifestEntry[] };

let cache: Manifest | null = null;

export const getManifest = async (): Promise<Manifest> => {
  if (cache) return cache;
  const res = await fetch(import.meta.env.VITE_TPL_MANIFEST_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`manifest fetch failed: ${res.status}`);
  cache = await res.json();
  return cache!;
};

export const resolveTemplateUrl = async (id: string): Promise<string> => {
  const m = await getManifest();
  const e = m.entries.find(x => x.id === id);
  if (!e) throw new Error(`template not found: ${id}`);
  if (e.url) return e.url; // public

  // private: 署名 API を叩く
  // const signEndpoint = import.meta.env.VITE_SIGN_ENDPOINT;
  // if (!signEndpoint) throw new Error('VITE_SIGN_ENDPOINT is not set for private mode');

  // const signRes = await fetch(`${signEndpoint}?key=${encodeURIComponent(e.key)}`, { cache: 'no-store' });
  // if (!signRes.ok) throw new Error(`sign failed: ${signRes.status}`);
  // const { signedUrl } = await signRes.json();
  // return signedUrl as string;
};
