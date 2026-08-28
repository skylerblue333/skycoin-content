# SkyMedia — Wave 2 slot #110

SkyMedia is a bounded engineering-beta media metadata core.

## Capability
- Validates and normalizes asset identity, owner, media kind, content type, size, and optional SHA-256 metadata.
- Enforces a deterministic draft -> ready lifecycle plus archive behavior.
- Publishes versioned `sky.media.register.v1` / `sky.media.asset.v1` integration identifiers.

## SKYCOIN4444 integration boundary
This module registers metadata only. A separate authenticated storage/upload service may consume the resulting asset contract. `uploadsBytes` and `hostsMedia` are deliberately `false`.

## Limitations
No file upload, object storage, CDN, transcoding, malware scanning, DRM, copyright verification, moderation, streaming, durable persistence, authorization service, compliance certification, or verified production deployment is included.
