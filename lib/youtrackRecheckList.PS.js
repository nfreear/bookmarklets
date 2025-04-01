/**
 * Recheck list – copies YouTrack issue info for pasting into Slack or Excel – updated 27/01/2023.
 *
 * @copyright Paul Speller, 27/01/2023.
 * @see https://codepen.io/paulspeller/full/GRBOYOj
 */

export function youtrackRecheckListBookmarkletPSpeller () {
  if (window.location.href.includes('abilitynet.myjetbrains.com/youtrack/issues/') || window.location.href.includes('abilitynet.myjetbrains.com/youtrack/search')) {
    if (sL = prompt('Paste issue ID list (line-, comma-, space- or tab-separated), or submit empty to retrieve all issues currently shown on this page'), sL != null) {
      aI = document.getElementsByTagName('yt-issue-id');
      aS = document.getElementsByTagName('yt-issue-summary');
      aC = document.getElementsByTagName('yt-issue-custom-field-lazy');
      sO = '';
      sT = '<table>';
      sE = '';
      aP = [];
      aD = [];
      aR = [];
      if (sL.length < 3) { for (let k = 0; k < aI.length; k++) aR.push(aI[k].innerText); } else {
        aR = sL.split(/\r?\n|\r|\n| |,|\t/g), aR = aR.filter(function (a) {
          return /[a-zA-Z0-9]/g.test(a);
        });
      }
      for (let h = 0; h < aC.length; h++) aC[h].title.startsWith('Pages') ? aP.push(aC[h].innerText) : aC[h].title.startsWith('Devices') && aD.push(aC[h].innerText.replace('Mobile (iOS)', 'iOS').replace('Mobile (Android)', 'Android').replace('iPad (iOS)', 'iPad'));
      for (let i = 0; i < aR.length; i++) {
        sR = aR[i].replace(/[^a-zA-Z0-9_\-]/g, '').toUpperCase();
        for (var iI = -1, j = 0; j < aI.length; j++) {
          if (sR == aI[j].innerText) {
            iI = j;
            break;
          }
        }
        if (iI < 0) sE += sR + ': not found on this page\n';
        else {
          sO += '<a href="https://abilitynet.myjetbrains.com/youtrack/issue/' + sR + '">' + sR + '</a> ' + aS[iI].innerText;
          sT += '<tr><td><a href="https://abilitynet.myjetbrains.com/youtrack/issue/' + sR + '">' + sR + '</a></td><td>' + aS[iI].innerText + '</td>';
          aD[iI] && (sO += ' &ndash; ' + aD[iI], sT += '<td>' + aD[iI] + '</td>');
          if (aP[iI]) {
            let sP = 'p ' + aP[iI];
            sP.startsWith('p All') && (sP = sP.replace('p All', 'All'));
            sO += ' &ndash; ' + sP.replaceAll(' 0', ' ').replaceAll(', ', ',');
            sT += '<td>' + sP + '</td>';
          }
          sO += '<br>\r\n';
          sT += '</tr>';
        }
      }
      sT += '</table>';
      const wN = window.open('', 'NW', 'width=400,height=400,resizable=1');

      const content = sO;
      wN.document.writeln('<html><head><title>Recheck list for Slack/Excel</title><style>body{font-family:sans-serif}button{padding:1em;font-size:larger;margin-bottom:1em;}#oO{display:block}#oT{display:none}td{vertical-align:top;}</style>');
      wN.document.writeln('<script>function copySlack(){document.getElementById("oO").style.display="block";document.getElementById("oT").style.display="none";window.document.getSelection().setBaseAndExtent(document.getElementById("oO"), 0, document.getElementById("endS"), 0);window.document.execCommand("copy")} function copyExcel(){document.getElementById("oT").style.display="block";document.getElementById("oO").style.display="none";window.document.getSelection().setBaseAndExtent(document.getElementById("oT"), 0, document.getElementById("endT"), 0);window.document.execCommand("copy")}\x3c/script></head>');
      wN.document.writeln('<body><button onclick="copySlack()">Copy for Slack</button> <button onclick="copyExcel()">Copy for Excel</button><div id="oO">');
      wN.document.writeln(sO);
      wN.document.writeln('</div><div id="endS"> </div><div id="oT">');
      wN.document.writeln(sT);
      wN.document.writeln('</div><div id="endT"> </div></body></html>');
      wN.document.close();
      const oS = wN.document.getElementById('oO');

      const oE = wN.document.getElementById('endS');
      wN.document.getSelection().setBaseAndExtent(oS, 0, oE, 0);
      wN.document.execCommand('copy');
      sE != '' && alert(sE);
    }
  } else alert('This bookmarklet can only be used on a YouTrack issues listing');
  void 0;
}
