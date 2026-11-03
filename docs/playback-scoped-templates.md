# Playback inspection and scoped templates

## Behaviour

The project style remains the default. Templates now offers **All captions (default)**, **Selected captions**, and **Selected words**. The T action on a transcript row selects its caption, pauses/seeks the preview to it, and opens Templates. Focusing a word exposes its Template action. A selected-caption scope expands a partial selection to its complete currently displayed caption; selected-word scope affects exactly the selected IDs.

Applying a template is one history operation. Changing the default preserves overrides. **Use default template** removes overrides for the current targets and is undoable. Existing grouping, word text, timing, placement, and masks are preserved. Custom saved presets use the same scope. Style changes do not invoke recognition.

Overrides are optional `Word.styleOverride` snapshots in the existing version-1 project, carried through validation, JSON download/import, local autosave, undo/redo, timeline edits, and the export worker. Existing projects remain readable. Placement and grouping remain project-wide; the typography inspector still edits the default style. A line-pill template selected for one word draws a pill around that word; uniform caption overrides retain their full-line treatment. SRT remains plain text/timing and cannot encode template styling.

The shared renderer resolves a uniform phrase style or measures mixed fonts, weights, sizes, outlines, boxes, and motion envelopes per word. It reserves stable space across animation frames. Preview and MP4 export use this same code; no separate overlay or subtitle timing approximation is introduced.

## Playback root causes and repair

A native Chromium reproduction on the pre-fix app (`846cb80`, same playback handlers as `514766a`) used `video.load()`, the app's Play action, and immediate Pause in the same browser task. The UI reported:

> The play() request was interrupted by a call to pause().

A warm, already-buffered play/pause did not consistently reproduce it. This is expected browser cancellation, not evidence of an unsupported codec. The previous handler surfaced every rejected play promise as an error, and its generic Retry opened transcription. The native media error handler also described every media failure as an unsupported codec.

The new playback path ignores expected aborts, invalidates stale play requests on pause/import, checks the current source, and distinguishes permission, read, decoder, and unsupported-format failures. A dedicated **Reload preview** action reloads the current source and restores its playback position without starting recognition or losing caption edits. Playback remains available during recognition; export retains the existing pause policy. Heavy source decoding, model selection, and audio encoding are unchanged.

## Verification (2026-11-03)

| Area | Result / evidence |
| --- | --- |
| Unit tests | 73 passed in 10 files, including scoped targets, persistence, invalid override rejection, unchanged timing, default inheritance and playback classification. |
| Production | TypeScript and Vite production build passed. |
| Native interrupted playback | 10 cold load/play/pause cycles with a real MP4; no false error. Normal playback advanced and paused. |
| Recovery | Controlled MediaError code 3 injection; Reload preview restored 1.2 seconds and did not open transcription. This is a routing/recovery test, not a reproduced hardware decoder failure. |
| Scoped editor | Real UI caption/word actions, default changes, override reset, undo/redo, JSON import, reload, and mobile template selection passed. |
| Mixed layout | All 28 presets as word overrides, 3 aspect ratios, large text/stroke and custom word motions: 84 configurations, 504 painted frames, no measured glyph overlap or safe-area overflow. |
| Existing extended layouts | 352 configurations / 2,816 frames, no measured overlap or overflow. |
| Mixed MP4 | Real 3-second 720×1280 H.264/AAC export fully decoded by FFmpeg. Three frames cover mixed words, a uniform phrase override and the untouched default. Caption-region preview/export IoU exceeds 0.94. |
| Full editor regression | Desktop/mobile imports, live text edit, undo/redo, presets, typography, grouping/delay, timing/resize, transitions, custom presets, project reload and real 9-second MP4 passed. Audio lag 0 samples; correlation 0.999999969. |
| Caption tools | Find/replace, bulk tools, delay, timing, split and transitions passed at 360, 412 and 1440 CSS pixels. |
| Positioning | Mouse/touch caption dragging, undo/redo, persistence and MP4 export passed. |
| Recognition lifecycle | Controlled-worker cancellation, stale completion, repeat cache and style-edit preservation passed; scoped template changes did not restart recognition. The older test's outdated template/model selectors were updated without removing its assertions. |

Commands: `npm run test`, `npm run build`, `npm run test:scoped-templates`, `FRAME_TEST_PORT=4353 npm run test:browser`, `node tests/caption-style-layout.mjs --layout-only`, `npm run test:caption-panel`, `node tests/caption-drag.mjs`, `node tests/native-jobs.mjs`.

Artifacts and logs are in `test-results/` (ignored generated outputs), copied into `/workspace/releases/evidence-playback-scoped-templates` for this session.

## Limits

This is an inspection of the tested editor workflows, not proof that every browser/codec/input is error-free. No physical Android device or the user's intermittent failing clip was available. Android-sized Chromium tests cannot establish an Android GPU/WASM crash resolution. Recognition lifecycle tests use a controlled worker; fresh real Shruti/Whisper inference and speech accuracy were not re-benchmarked in this patch. Existing full-recording audio caching/decoding and long-clip memory behaviour remain separate resource-lifecycle work. Production is unchanged until this branch is deployed.
