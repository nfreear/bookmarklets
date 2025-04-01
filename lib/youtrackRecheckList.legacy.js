/**
 * @LEGACY
 * @author Nick Freear, 10-Nov-2023
 * @see https://codepen.io/nfreear/pen/vYbmzLB
 */

/** The bookmarklet JavaScript, enclosed in an Immediately Invoked Function Expression (IIFE).
 * @see https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 */
export function youtrackRecheckListBookmarkletLegacy () {
  (() => {
    const ELEMS = document.querySelectorAll('yt-issue-list-item');
    const DATA = [...ELEMS].map((el) => {
      const issueId = el.querySelector('yt-issue-id').textContent;
      const summary = el.querySelector('yt-issue-summary').textContent;
      const pages = customField(el, 'Pages Affected').split(',');
      const wcagCriteria = customField(el, 'Success Criteria');
      const commonIssue = customField(el, 'Common Issues');
      const comEl = el.querySelector('.yt-issues-issue__actions__comments');
      const comments = comEl ? parseInt(comEl.textContent) : 0;

      const priority = customField(el, 'Priority');
      const tagsEl = el.querySelectorAll('.yt-issue-tags__tag');

      const updated = el.querySelector('.yt-issues-issue__date').textContent.trim();
      const today = /^\d\d:\d\d/.test(updated);

      const tags = [...(tagsEl || [])].map(el => el.textContent.trim());

      return { issueId, summary, pgLen: pages.length, pages, comments, commonIssue, wcagCriteria, priority, tags, updated, today };
    });

    const rows = DATA.map((it) => `${it.issueId},${it.summary},${it.commonIssue},"${it.wcagCriteria}",${it.pgLen},"${it.pages.join(',')}",${it.comments},${it.priority},"${it.tags.join(',')}",${it.updated},${it.today ? 'Y' : 'N'}`);

    console.log('Issues:', DATA);
    console.log('csv');
    console.log(rows.join('\n'));

    const TA = document.createElement('textarea');
    TA.value = rows.join('\n');
    TA.style = 'position:absolute; bottom:0; background:#fff; color:#000; font-size: small; z-index: 9999;';
    document.body.appendChild(TA);

    function customField (elem, name) {
      const EL = elem.querySelector(`yt-issue-custom-field-lazy[title *= "${name}:"]`);
      return EL ? EL.textContent : null;
    }
  })();
}
