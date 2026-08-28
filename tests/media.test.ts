import { describe, expect, it } from 'vitest';
import { SKY_MEDIA_CONTRACT, archiveMedia, createMediaAsset, markMediaReady } from '../src/media';

describe('SkyMedia', () => {
  const input = {
    assetId: 'asset-1', ownerId: 'owner-1', kind: 'image' as const,
    contentType: 'IMAGE/PNG', sizeBytes: 2048,
    checksumSha256: 'a'.repeat(64),
  };

  it('creates normalized metadata without hosting bytes', () => {
    expect(createMediaAsset(input)).toEqual({ ...input, contentType: 'image/png', state: 'draft' });
  });

  it('enforces bounded lifecycle transitions', () => {
    const ready = markMediaReady(createMediaAsset(input));
    expect(ready.state).toBe('ready');
    expect(() => markMediaReady(ready)).toThrow('invalid_media_transition');
    expect(archiveMedia(ready).state).toBe('archived');
  });

  it('rejects invalid metadata', () => {
    expect(() => createMediaAsset({ ...input, sizeBytes: -1 })).toThrow('invalid_size_bytes');
    expect(() => createMediaAsset({ ...input, checksumSha256: 'nope' })).toThrow('invalid_checksum');
    expect(() => createMediaAsset({ ...input, contentType: ' ' })).toThrow('invalid_content_type');
  });

  it('publishes a metadata-only integration boundary', () => {
    expect(SKY_MEDIA_CONTRACT.register).toBe('sky.media.register.v1');
    expect(SKY_MEDIA_CONTRACT.uploadsBytes).toBe(false);
    expect(SKY_MEDIA_CONTRACT.hostsMedia).toBe(false);
  });
});
