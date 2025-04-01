/**
 * Version 2.
 * @author NDF, 01-April-2025.
 * @see https://codepen.io/nfreear/pen/RNwqzjz
 */

/** The bookmarklet JavaScript, enclosed in an Immediately Invoked Function Expression (IIFE).
 * @see https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 */
//
export function youtrackRecheckList () {
(() => {
  const LIST = document.querySelector('[ class *= ticketListWrapper__ ]');
  const ELEMS = LIST.querySelectorAll('[ class *= outerWrapper__ ]');
  console.debug('Items:', ELEMS);
	const DATA = [...ELEMS].map((el)=>{
	  const issueId = el.querySelector('a[ class *= ticketId__ ]').textContent;
	  const summary = el.querySelector('[ class *= summaryCell__ ] a').textContent;
	  const pages = []; /* customField(el, 'Pages Affected').split(',');*/
    const wcagCriteria = customField(el, /^\d\.\d\.\d+: \w+/);
    const commonIssue = customField(el, /[\w ]+, \d\.\d\.\d+\w/);
    const comEl = null; /* el.querySelector('.yt-issues-issue__actions__comments'); */
    const comments = comEl ? parseInt(comEl.textContent) : 0;

    const priority = null; /*customField(el, 'Priority');*/
    const tagsEl = el.querySelectorAll('.yt-issue-tags__tag') || [];

    const updated = el.querySelector('[ class *= AndDateBlock__ ] [ aria-label ^= Updated ]').textContent.trim();
    const today = /^\d\d:\d\d/.test(updated);

    const tags = [...(tagsEl || [])].map(el => el.textContent.trim());

	  return { issueId, summary, pgLen: pages.length, pages, comments, commonIssue, wcagCriteria, priority, tags, updated, today };
  });

  const rows = DATA.map((it) => `${it.issueId},${it.summary},${it.commonIssue},"${it.wcagCriteria}",${it.pgLen},"${it.pages.join(',')}",${it.comments},${it.priority},"${it.tags.join(',')}",${it.updated},${it.today ? 'Y': 'N'}`);

  console.log('Issues:', DATA);
  console.log('csv');
  console.log(rows.join('\n'));

  const TA = document.createElement('textarea');
  TA.value = rows.join('\n');
  TA.style = 'position:absolute; bottom:0; background:#fff; color:#000; font-size: small; z-index: 9999;'
  document.body.appendChild(TA);

  function customField (elem, regex) {
    const RE = new RegExp(regex);
    const fieldsBlock = elem.querySelector('[ class *= fieldsBlock__ ]');
    const fieldElems = fieldsBlock.querySelectorAll('[ class *= fieldValue__ ]');
    const VALUES = [...fieldElems].map(el => el.textContent);
    return VALUES.find(val => RE.test(val));
  }
})();
}

export function legacyCustomField (elem, name) {
     const EL = elem.querySelector(`yt-issue-custom-field-lazy[title *= "${name}:"]`);
     return EL ? EL.textContent : null;
}
