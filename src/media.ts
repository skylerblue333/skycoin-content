export type MediaKind = 'image' | 'video' | 'audio' | 'document';
export type MediaState = 'draft' | 'ready' | 'archived';

export interface MediaAssetInput {
  assetId: string;
  ownerId: string;
  kind: MediaKind;
  contentType: string;
  sizeBytes: number;
  checksumSha256?: string;
}

export interface MediaAsset extends MediaAssetInput {
  state: MediaState;
}

function requireToken(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized || normalized.length > 180) throw new Error(`invalid_${field}`);
  return normalized;
}

export function createMediaAsset(input: MediaAssetInput): MediaAsset {
  const assetId = requireToken(input.assetId, 'asset_id');
  const ownerId = requireToken(input.ownerId, 'owner_id');
  const contentType = requireToken(input.contentType, 'content_type').toLowerCase();
  if (!Number.isSafeInteger(input.sizeBytes) || input.sizeBytes < 0 || input.sizeBytes > 10_000_000_000) {
    throw new Error('invalid_size_bytes');
  }
  if (input.checksumSha256 && !/^[a-f0-9]{64}$/i.test(input.checksumSha256)) {
    throw new Error('invalid_checksum');
  }
  return { ...input, assetId, ownerId, contentType, state: 'draft' };
}

export function markMediaReady(asset: MediaAsset): MediaAsset {
  if (asset.state !== 'draft') throw new Error('invalid_media_transition');
  return { ...asset, state: 'ready' };
}

export function archiveMedia(asset: MediaAsset): MediaAsset {
  if (asset.state === 'archived') return asset;
  return { ...asset, state: 'archived' };
}

export const SKY_MEDIA_CONTRACT = {
  register: 'sky.media.register.v1',
  receipt: 'sky.media.asset.v1',
  uploadsBytes: false,
  hostsMedia: false,
} as const;
