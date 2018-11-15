/*!
  Teamwork Desk bookmarklet ~ batch delete customers based on 'lastTicketDate' and/or 'numTickets' criteria.

  © Nick Freear, 30-October-2018 | License: GPL-3.0+

  Gist :- https://gist.github.com/nfreear/e295be4edf0c656b3c28018ea997f637

  npx live-server --port=9001

  Bookmarklet :-

  javascript:(function(){var D=document,s=D.createElement('script');s.src='http://127.0.0.1:9001/lib/teamdesk.js?r='+(Math.random());D.body.appendChild(s)})();
*/

((W, fetch, Request) => {
  'use strict';

  const CFG = {
    __do_delete: false,

    bookmarklet_name: 'TeamDesk delete',

    delete_limit: 2, // Was: 25.
    tickets_limit: 0, // Was: 99, 2.
    date_regex: /^201[789]-\d{2}-\d{2}T\d/, // Keep customers with these 'lastTicketDate's.

    // year_limit: 1.5 * 365 * 24 * 60 * 60 * 1000, // 18 months ??

    td_url_regex: /https:\/\/iet.eu.teamwork\.com\/desk\/#\/customers/,
    td_api_url: 'https://iet.eu.teamwork.com/desk/v1/customers.json?Page=1&Order=lastticketdate&Direction=asc&Verified=true',
    td_user_url: 'https://iet.eu.teamwork.com/desk/v1/customers/%s.json',

    location: window.location.href
  };

  console.warn('Teamwork Desk - delete bookmarklet. Config:', CFG);

  if (!CFG.td_url_regex.test(CFG.location)) {
    throw new Error('Teamwork error. Invalid URL:', CFG.location);
  }

  console.warn('Teamwork API:', CFG.td_api_url);

  // let promises = [];

  fetch(CFG.td_api_url)
    .then(response => response.json())
    .then(jsonData => {
      console.warn('OK. Teamwork customers:', jsonData);

      const SKIP_CUSTOMERS = jsonData.customers.filter((cust, idx) => (
        cust.numTickets > CFG.tickets_limit || (cust.lastTicketDate && CFG.date_regex.test(cust.lastTicketDate)) || idx >= CFG.delete_limit));
      const DELETE_CUSTOMERS = jsonData.customers.filter((cust, idx) => (
        cust.numTickets <= CFG.tickets_limit && (!cust.lastTicketDate || !CFG.date_regex.test(cust.lastTicketDate)) && idx < CFG.delete_limit));

      console.warn('Skip:', SKIP_CUSTOMERS);
      console.warn('Delete:', DELETE_CUSTOMERS);

      return DELETE_CUSTOMERS;
    })
    .then(deleteCustomers => {
      if (!CFG.__do_delete || !W.confirm('Are you sure you want to delete %s customers?', deleteCustomers.length)) {
        return console.warn('DO NOT DELETE!');
      }

      deleteCustomers.forEach(customer => {
        const A_USER_URL = CFG.td_user_url.replace(/%s/, customer.id);
        const DELETE_REQUEST = new Request(A_USER_URL, { method: 'DELETE', headers: { Accept: 'application/json' }, body: null });

        fetch(DELETE_REQUEST)
          .then(response => response.json())
          .then(jsonData => console.warn('Teamwork OK. Deleted customer:', jsonData))
          .catch(error => console.error('Teamwork error:', error));
      });
    })
    .catch(error => console.error('Teamwork error:', error));

  // Promise.all() ??
  // .
})(window, window.fetch, window.Request);
