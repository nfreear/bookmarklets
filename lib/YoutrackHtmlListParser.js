/**
 * Version 2.
 * @author NDF, 01-April-2025.
 * @see https://codepen.io/nfreear/pen/RNwqzjz
 */

export class YoutrackHtmlListParser {
  get listSelector () { return '[ class *= ticketListWrapper__ ]'; }
  get itemSelector () { return '[ class *= outerWrapper__ ]'; }

  get customFieldsSelector () { return '[ class *= fieldsBlock__ ]'; }
  get fieldValueSelector () { return '[ class *= fieldValue__ ]'; }

  get issueIdSelector () { return 'a[ class *= ticketId__ ]'; }
  get summarySelector () { return '[ class *= summaryCell__ ] a'; }
  get updatedSelector () { return '[ class *= AndDateBlock__ ] [ aria-label ^= Updated ]'; }

  get wcagSCRegex () { return /^\d\.\d\.\d+: \w+/; } // "1.1.1: Non text Content [2.0 AA]"
  get ciRegex () { return /[\w ]+, \d\.\d\.\d+\w/; }

  parse (DOC) {
    const issuesList = DOC.querySelector(this.listSelector);
    console.assert(issuesList, 'issuesList - Not found.');
    const listItems = issuesList.querySelectorAll(this.itemSelector);
    console.assert(listItems, 'listItems - Not found.');

    const DATA = [...listItems].map((el) => this.parseItem(el));
    console.debug('Parser issues:', DATA);
    return DATA;
  }

  parseItem (el) {
    const issueId = el.querySelector(this.issueIdSelector).textContent;
    const summary = el.querySelector(this.summarySelector).textContent;
    const pages = []; /* customField(el, 'Pages Affected').split(','); */
    const wcagCriteria = this.customField(el, this.wcagSCRegex);
    const commonIssue = this.customField(el, this.ciRegex);
    const comEl = null; /* el.querySelector('.yt-issues-issue__actions__comments'); */
    const comments = comEl ? parseInt(comEl.textContent) : 0;

    const priority = null; /* customField(el, 'Priority'); */
    const tagsEl = el.querySelectorAll('.yt-issue-tags__tag') || [];

    const updated = el.querySelector(this.updatedSelector).textContent.trim();
    const today = /^\d\d:\d\d/.test(updated);

    const tags = [...(tagsEl || [])].map(el => el.textContent.trim());

    return { issueId, summary, pgLen: pages.length, pages, comments, commonIssue, wcagCriteria, priority, tags, updated, today };
  }

  customField (elem, regex) {
    const RE = new RegExp(regex);
    const fieldsBlock = elem.querySelector(this.customFieldsSelector);
    console.assert(fieldsBlock, 'Custom fields block - Not found.');
    const fieldElems = fieldsBlock.querySelectorAll(this.fieldValueSelector);
    console.assert(fieldElems, 'fieldElems - Not found.');
    const VALUES = [...fieldElems].map(el => el.textContent);
    return VALUES.find(val => RE.test(val));
  }
}

export default YoutrackHtmlListParser;
