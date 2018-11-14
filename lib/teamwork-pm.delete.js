/*!
  Teamwork PM bookmarklet ~ delete users based on 'lastActive' and/or 'lastLogin' criteria.

  © Nick Freear, 14-November-2018 | License: GPL-3.0+

  Gist :- https://gist.github.com/nfreear/#

  npx live-server --port=9001

  Bookmarklet :-

  javascript:(function(){var D=document,s=D.createElement('script');s.src='http://127.0.0.1:9001/lib/teamwork-pm.js?r='+(Math.random());D.body.appendChild(s)})();
*/

((W) => {

const CFG = {
  __do_delete: false,

  bookmarklet: true,
  name: 'Teamwork PM delete',

  delete_limit: 1,  // Was: 25.
  date_regex: /^201[789]-\d{2}-\d{2}T\d/, // Keep users with these 'lastActive' dates.

  tw_url_regex: /https:\/\/iet.eu\.teamwork\.com\/(index.cfm)?#\/people\/loginHistory/,
  tw_api_url: 'https://iet.eu.teamwork.com/projects/api/v2/people.json?&_returnLetters=true&page=3&pageSize=33&sort=lastlogin&', // &page=94&pageSize=1&sort=lastlogin&
  tw_user_url: 'https://iet.eu.teamwork.com/people/%s.json',
  // tw_user_url: 'https://iet.eu.teamwork.com/projects/api/v2/people.json',

  location: W.location.href
}

console.warn('Teamwork PM - delete bookmarklet. Config:', CFG);

if (!CFG.tw_url_regex.test(CFG.location)) {
  throw new Error('Teamwork PM error. Invalid URL:', CFG.location);
}

console.warn('Teamwork PM API:', CFG.tw_api_url);

let promises = [];

fetch(CFG.tw_api_url)
  .then(response => response.json())
  .then(jsonData => {
    console.warn('OK. Teamwork PM users:', jsonData);

    const REV_PEOPLE = jsonData.people.reverse();
    const SKIP_USERS = REV_PEOPLE.filter((user, idx) => (
      user.loginCount > 0 && user.lastLogin && CFG.date_regex.test(user.lastLogin)) || idx >= CFG.delete_limit);
    const DELETE_USERS = REV_PEOPLE.filter((user, idx) => (
      user.loginCount === 0 || ! user.lastLogin || ! CFG.date_regex.test(user.lastLogin)) && idx < CFG.delete_limit);

    console.warn('Skip, REV:', SKIP_USERS);
    console.warn('Delete, REV:', DELETE_USERS);

    return DELETE_USERS;
  })
  .then(deleteUsers => {
    if (! CFG.__do_delete) {
      return console.warn('DO NOT DELETE!');
    }

    deleteUsers.forEach(user => {
      let USER = user;
      USER.emailAddress = USER.emailAddress.replace(/@/, '-XX@');
      USER.tags = null;

      const A_USER_URL = CFG.tw_user_url.replace(/%s/, user.id);
      const PUT_REQUEST = new Request(A_USER_URL, { method: 'PUT', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ person: USER }) });
      const DELETE_REQUEST = new Request(A_USER_URL, { method: 'DELETE', headers: { Accept: 'application/json' }, body: null });

      fetch(PUT_REQUEST)
        .then(response => response.json())
        .then(jsonData => {
          console.warn('Teamwork PM OK. Updated user:', jsonData);

          return fetch(DELETE_REQUEST);
        })
        .then(response => response.json())
        .then(jsonData => console.warn('TeamworkPM OK. Deleted user:', jsonData))
        .catch(error => console.error('Teamwork PM error:', error));
    });
  })
  .catch(error => console.error('Teamwork PM error:', error));

})(window);

// End.
