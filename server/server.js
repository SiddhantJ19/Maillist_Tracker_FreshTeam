var {getAllTeamDetails, storeTeamdetails} = require('./lib/TeamDetails');
var {subscribeEmployee, unsubscribeEmployee} =
    require('./lib/SubscribeEmployee');
var {resolveTeamName} = require('./lib/SubscribeUtil')

exports = {

  events: [
    {event: 'onAppInstall', callback: 'onAppInstallHandler'},
    {event: 'onEmployeeCreate', callback: 'onEmployeeCreateHandler'},
    {event: 'onEmployeeUpdate', callback: 'onEmployeeUpdateHandler'},
  ],


  onAppInstallHandler: function(args) {
    let res = getAllTeamDetails(args.iparams, args.domain)
                  .then((teams) => storeTeamdetails(teams))
                  .catch(err => console.error(err));

    Promise.all([res])
        .then(() => renderData({message: 'Saved Team details to datastore'}))
        .catch(err => renderData({message: err.message}))
  },

  onEmployeeCreateHandler: function(args) {
    let mailgun = require('mailgun-js')(
        {apiKey: args.iparams.api_key, domain: args.iparams.domain});
    let employee = getEmployeeDetails(args);

    subscribeEmployee(mailgun, employee)
        .then(data => console.log(data))
        .catch(err => console.error(err));
  },


  onEmployeeUpdateHandler: function(args) {
    let mailgun = require('mailgun-js')(
        {apiKey: args.iparams.api_key, domain: args.iparams.domain});

    let employee = getEmployeeDetails(args);
    if (hasTeamChanged(args)) {
      const prev_team_id =
          args['data']['changes']['model_changes']['team_id'][0];
      const prev_team_name = resolveTeamName(prev_team_id);

      Promise.resolve(prev_team_name)
          .then(
              (prev_team_name) =>
                  unsubscribeEmployee(mailgun, employee, prev_team_name))
          .then(() => subscribeEmployee(mailgun, employee))
          .then(() => console.log('added again'))
          .catch(err => console.error(err));
    }
  }

};


function getEmployeeDetails(args) {
  let employee = args['data']['employee'];
  let associations = args['data']['associations'];
  return {
    name: (employee.first_name || '') + (employee.middle_name || '') +
        (employee.last_name || ''),
        email: employee['official_email'], team_id: associations['team']['id']
  }
}

function hasTeamChanged(args) {
  return args['data']['changes']['model_changes'].hasOwnProperty('team_id');
}