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
  get pagesRegex () { return /(^\d\d(, \d\d)*|None|All Pages)/; }
  get devicesRegex () { return /(Desktop|Mobile|Tablet).*/; }
  get priorityRegex () { return /(High|Medium|Low)/; }
  get statusRegex () { return /(Open|Partially Fixed|Resolved)/; }

  get updatedRegex () { return /^Updated by ([\w ]+) on (\d[\w: ]+)$/; } // Updated by AN Export Script on 31 Mar 2025 16:16

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
    const pages = this.customField(el, this.pagesRegex).split(','); /* customField(el, 'Pages Affected').split(','); */
    const wcagCriteria = this.customField(el, this.wcagSCRegex);
    const commonIssue = this.customField(el, this.ciRegex);
    const comEl = null; /* el.querySelector('.yt-issues-issue__actions__comments'); */
    const comments = comEl ? parseInt(comEl.textContent) : 0;

    const priority = this.customField(el, this.priorityRegex); /* customField(el, 'Priority'); */
    const status = this.customField(el, this.statusRegex);
    const devices = this.customField(el, this.devicesRegex);
    const tagsEl = el.querySelectorAll('.yt-issue-tags__tag') || [];

    const updatedElem = el.querySelector(this.updatedSelector); // .textContent.trim();
    const updatedText = updatedElem.getAttribute('aria-label').trim();
    const mmUpdated = updatedText.match(this.updatedRegex);
    const updatedBy = mmUpdated ? mmUpdated[1] : null;
    const updated = mmUpdated ? mmUpdated[2] : null;

    const today = false; // /^\d\d:\d\d/.test(updated);

    const tags = [...(tagsEl || [])].map(el => el.textContent.trim());

    return {
      issueId,
      summary,
      pgLen: pages.length,
      pages,
      comments,
      commonIssue,
      wcagCriteria,
      priority,
      status,
      devices,
      tags,
      updated,
      updatedBy,
      today
    };
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
