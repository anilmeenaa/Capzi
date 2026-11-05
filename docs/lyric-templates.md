# Sitam Ink and Laal Junoon

Two independent editable presets from the user's 13.421-second painting/poetry video and 19.920-second song edit (both 720 × 1280). Full-resolution frames were inspected at 1, 3, 6 and 10 seconds, with one-second contact sheets across the clips.

- **Sitam Ink:** deep red (#790500), high-contrast Devanagari display typography, centered stacked words with cumulative reveal. Locally bundled Rozha One provides a close licensed alternative to the unidentified source lettering. The template uses a 1.7 optical size factor for the large calligraphic treatment; shared fitting clamps it inside the frame. Rows obey the user's line count, including longer groups.
- **Laal Junoon:** vivid red (#ff0015), condensed bold Khand, clean spoken-word cuts and right-of-center placement. The reference has manually masked text behind the person, shot-specific positions and an occasional oversized echo title. This preset reproduces the primary red lettering/cut treatment; automatic subject segmentation and shot composition are not added.

Both font files come from Google Fonts ofl/rozhaone and ofl/khand under SIL OFL 1.1, with license notices bundled. Exact source font identities and bespoke swashes are unverified. Uploaded video, paintings, logos and music are not distributed.

Choose a template and use **Use template layout** to apply its recommended position and grouping. All existing font/color/timing controls remain available. The preset does not translate or convert scripts: native Hindi, Roman Hinglish and mixed text are supported. Automatic transcription keeps its existing Roman default. Imported subtitle/project text and manually edited text now preserve Unicode across save/reload, fixing the previous unconditional romanization on import and restore.

The shared preview/export renderer uses actual caption timing. SRT cue word times remain explicitly estimated by the existing importer; the template does not claim forced alignment. Recovered segments are not assigned fabricated word timings. No additional AI model or processing service is added.

## Verified results

- 85 unit tests, TypeScript and production Vite build passed.
- Layout regression: 512 cases / 4,096 frames, no detected overflow or overlap.
- Desktop/Android-sized editor browser suite passed, including existing 9-second MP4 export; source audio correlation 0.999999969 at zero-sample lag.
- New templates passed mobile selection, layout application, color editing, undo/redo and persistence at 360 px / Pixel 7 sizes.
- Both new templates exported real two-second 720 × 1280 MP4s with imported Devanagari `जिसे पाना था` captions and audio. FFmpeg fully decoded each output. Four sampled caption frames per style matched preview: Sitam Ink mask IoU 0.924–0.925; Laal Junoon 0.916–0.935. Red chroma edges change under lossy encoding, so the masks are not byte-identical.
- Native text was asserted immediately after SRT import and again after local project reload. Source video may need reconnecting after reload; this is separate from transcript persistence. The initial new test wrongly waited for automatic media restoration and timed out; the final test checks transcript persistence independently after export.

Tests use deterministic generated footage and imported subtitles, not inference or a physical Android device. User reference clips are inspection-only and are not published. Production remains unchanged until deployment.
