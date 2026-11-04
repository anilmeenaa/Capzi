# Four uploaded reel caption looks

Implemented in Capzi on 2026-11-04. The user supplied four playable MP4s for an earlier five-Reel request. Upload order is used below; no unsupported mapping to Instagram URLs is assumed. The fifth video is still needed.

## Inspection and independent presets

Each video was decoded locally with FFmpeg. Full-resolution samples and 3 fps contact sheets were inspected, including late shots of the 83-second first video. No reference media, logos, or screenshots are bundled in the application.

| Upload | Video | Preset | Observed and implemented caption treatment |
| --- | --- | --- | --- |
| 1 | 960 × 720, 83.217 s | Film Diary | Fine ivory italic serif, whole phrases, lower placement, subtle shadow and direct phrase cuts. Uses Instrument Serif Italic. |
| 2 | 1280 × 720, 19.604 s | Ice Word | Heavy uppercase slab lettering, centered single-word cuts, white with a pale blue sheen. Uses Roboto Slab 900 and an independently drawn gradient. |
| 3 | 1280 × 720, 13.907 s | Momentum White | Large bold white sans, dark soft shadow and cumulative spoken-word reveal around the center. Uses Inter 800. |
| 4 | 1064 × 720, 12.244 s | Neon Editorial | Upper-right script phrase with a bold neon keyword. Uses Great Vibes and Barlow Condensed; explicit emphasis chooses the keyword, otherwise the middle word. |

Exact original font identities cannot be established from pixels alone. These are close licensed choices, not verified original fonts. Reference 2's texture is approximated with a procedural sheen. Reference 3 also has manually composed giant red titles and text behind the speaker; this preset implements its main white caption treatment, not automatic person masking or shot-by-shot typography. Reference 4 uses occasional yellow/red variants; the accent color remains editable. No branding/outro artwork is copied.

## Usage and compatibility

Choose a preset in Templates. Existing template application continues preserving project grouping and placement. **Use template layout** explicitly applies the built-in recommended words per phrase, character limit, line count, and X/Y placement; it is undoable. It does not alter word timestamps. Custom layout changes remain available.

All four styles work with normal captions, project save/load, local custom presets, all-caption/caption/word template scopes and the shared preview/export renderer. Whole-caption Neon Editorial supplies mixed script/keyword typography; an individual word override applies that template's main typeface, since a single word has no surrounding stack. Explicit user line limits remain respected.

Single-word cuts and cumulative reveal use actual word start/end times. Segment-only recovery remains a segment; it is not assigned invented per-word timing. Layout caching includes the visible token sequence so seeking and sequential reveals cannot reuse the preceding word's geometry.

Three font families are added locally (approximately 851 KB total TTF data): Instrument Serif and Great Vibes under SIL OFL 1.1, Roboto Slab under Apache-2.0. Original license files and sources are included in `public/fonts/references` and third-party notices, including the notice generator. No model, inference, network service, or dependency is added.

## Verification

- `npm run test`: 79 tests passed across 11 files, including six new timing/reveal/stack/project validation regressions.
- `npm run build`: TypeScript and production Vite build passed.
- `node tests/caption-style-layout.mjs --layout-only`: 416 cases / 3,328 frames; no overflow or overlap. Includes portrait, square, landscape, long words and extreme style settings.
- `npm run test:scoped-templates`: 96 mixed-style cases / 576 frames; no overflow or overlap. Playback/reload, scoped application, history and persistence passed. Real mixed-style MP4 fully decoded; preview/export caption-mask IoU 0.942–0.992.
- `npm run test:browser`: desktop and Pixel 7 / 360 × 740 emulation passed; editing, timeline, templates, custom presets, transitions and mobile sheets tested. Real 9-second 720 × 1280 H.264/AAC MP4 fully decoded. Original audio correlation 0.999999969 with zero-sample lag.
- `FRAME_REFERENCE_TEMPLATES=1 npm run test:templates`: four real two-second 720 × 1280 MP4 exports; preview/export comparison at 0.3, 0.9, 1.2 and 1.7 seconds covers word changes and phrase growth. Outputs checked with FFprobe and fully decoded with FFmpeg. Original audio track retained.

Export fixtures are deterministic local test footage with imported captions, not new ASR benchmarks. Uploaded references were inspected, not used as redistributed test fixtures. Physical Android hardware, exact original fonts, and the missing fifth reference remain unverified. Production is unchanged by this branch.
