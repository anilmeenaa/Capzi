/** Expected play/pause/source-replacement cancellation is not a media failure. */
export function playbackFailure(error:{name?:string;code?:number}):string{
 if(error.name==='AbortError'||error.code===1)return '';
 if(error.name==='NotAllowedError')return 'Playback needs a tap. Press Play again to allow video and audio.';
 if(error.code===2)return 'The video could not be read. Reload the preview; if it still fails, reconnect the original video.';
 if(error.code===3)return 'The browser video decoder stopped. Reload the preview to retry. Your caption edits are safe.';
 if(error.code===4||error.name==='NotSupportedError')return 'This browser cannot play this video format. Try an H.264 MP4 or VP9 WebM; keep your saved caption project.';
 return 'Video playback could not start. Reload the preview and press Play again. Your edits are safe.';
}
