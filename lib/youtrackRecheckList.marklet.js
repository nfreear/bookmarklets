
/** The bookmarklet JavaScript, enclosed in an Immediately Invoked Function Expression (IIFE).
 * @see https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 */
export function youtrackRecheckListBookmarklet () {
  (() => {
    const SCR = document.createElement('script');
    SCR.type = 'module';
    SCR.dataset.runBm = true;
    SCR.src = '{__ORIGIN__}/lib/youtrackRecheckList.js?run=true';
    document.body.appendChild(SCR);
    console.debug('YT Recheck List Bookmarklet:', SCR);
  })();
}

export default youtrackRecheckListBookmarklet;
