/**
 * Version 2.
 * @author NDF, 01-April-2025.
 * @see https://codepen.io/nfreear/pen/RNwqzjz
 */
import YoutrackHtmlListParser from './YoutrackHtmlListParser.js';

const { alert, prompt, open, DOMParser } = window;

const TEMPLATE = `
<template>
<title>Recheck list for Slack/Excel</title>
<style>
  body { font-family: sans-serif; }
  button {
    padding: 1em;
    font-size: larger;
    margin-bottom: 1em;
  }
  #slack, #oO { display: block }
  #table, #oT { display: none }
  td { vertical-align: top; }
</style>

<p>
  <button id="slackButton" X_onclick="copySlack()">Copy for Slack</button>
  <button id="tableButton" X_onclick="copyExcel()">Copy for Excel</button>
</p>
<div id="slack">
  <!-- wN.document.writeln(sO); -->
</div>
<div id="endSlack"> &nbsp;</div>
<div id="table">
  <!-- wN.document.writeln(sT); -->
</div>
<div id="endTable"> &nbsp;</div>

<script type="XX">
  const { document } = window;
  const slackEl = document.getElementById('slack');
  const slackEndEl = document.getElementById('endSlack');
  const tableEl = document.getElementById('table');
  const tableEndEl = document.getElementById('endTable');

  function copySlack () {
    slackEl.style.display = "block";
    tableEl.style.display = "none";
    document.getSelection().setBaseAndExtent(slackEl, 0, slackEndEl, 0);
    document.execCommand("copy");
  }
  function copyExcel () {
    tableEl.style.display = "block";
    slackEl.style.display = "none";
    document.getSelection().setBaseAndExtent(tableEl, 0, tableEndEl, 0);
    document.execCommand("copy");
  }
</script>

</template>
`;

class WindowManager {
  get templateHtml () { return TEMPLATE; }

  open () {
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(this.templateHtml, 'text/html');

    const template = doc.querySelector('template');
    const docFragment = template.content.cloneNode(true);

    this.WIN = window.open('', 'NW', 'width=400,height=400,resizable=1');
    this.DOC = this.WIN.document;
    // this.DOC.writeln('<html lang="en"></html>');

    this.DOC.body.appendChild(docFragment);
  }

  querySelector (selector) {
    const EL = this.DOC.querySelector(selector);
    console.assert(EL, `querySelector - Element not found: "${selector}"`);
    return EL;
  }

  get slackButton () { return this.querySelector('#slackButton'); }
  get tableButton () { return this.querySelector('#tableButton'); }

  get slackElem () { return this.querySelector('#slack'); }
  get slackEndElem () { return this.querySelector('#endSlack'); }

  // const tableEl = document.getElementById('table');
  // const tableEndEl = document.getElementById('endTable');

  listen () {
    this.slackButton.addEventListener('click', (ev) => this.slackClickHandler(ev));
  }

  slackClickHandler (ev) {
    console.debug('click:', ev);

    this.slackElem.style.display = 'block';
    // this.tableElem.style.display = "none";
    this.DOC.getSelection().setBaseAndExtent(this.slackElem, 0, this.slackEndElem, 0);
    this.DOC.execCommand('copy');

    this.WIN.alert('Click Slack!');
  }
}

/** The bookmarklet JavaScript, enclosed in an Immediately Invoked Function Expression (IIFE).
 * @see https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 */
export function youtrackRecheckList () {
  const ytParser = new YoutrackHtmlListParser();

  // const DATA = ytParser.parse(document);

  const winManager = new WindowManager();
  winManager.open();
  winManager.listen();

  // return DATA;
}

export function legacyCSVTextarea (DATA) {
  const rows = DATA.map((it) => `${it.issueId},${it.summary},${it.commonIssue},"${it.wcagCriteria}",${it.pgLen},"${it.pages.join(',')}",${it.comments},${it.priority},"${it.tags.join(',')}",${it.updated},${it.today ? 'Y' : 'N'}`);

  console.log('Issues:', DATA);
  console.log('csv');
  console.log(rows.join('\n'));

  const TA = document.createElement('textarea');
  TA.value = rows.join('\n');
  TA.style = 'position:absolute; bottom:0; background:#fff; color:#000; font-size: small; z-index: 9999;';
  document.body.appendChild(TA);
}

export function legacyCustomField (elem, name) {
  const EL = elem.querySelector(`yt-issue-custom-field-lazy[title *= "${name}:"]`);
  return EL ? EL.textContent : null;
}

const SCRIPT = document.querySelector('script[src *= "youtrackRecheckList.js"][src *= "run=true"]');
if (SCRIPT) {
  youtrackRecheckList();
}
