/**
 *
 * 2.1.4 Character Key Shortcuts Level A.
 * @see https://www.w3.org/WAI/WCAG22/quickref/#character-key-shortcuts
 * @see http://3needs.org/en/testing/code/kb-shortcuts.html
 */

/** The bookmarklet JavaScript, enclosed in an Immediately Invoked Function Expression (IIFE).
 * @see https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 */
export function characterKeyShortcutsBookmarklet () {
  (async () => {
    const MOD = await import('{__ORIGIN__}/lib/characterKeyShortcuts.esm.js');
    const { characterKeyShortcuts } = MOD;
    console.debug('Character Key Shortcuts:', MOD);
    await characterKeyShortcuts();
  })();
}

export default characterKeyShortcutsBookmarklet;
