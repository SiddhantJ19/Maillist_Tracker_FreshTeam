const {
  resolveTeamName,
  getAllMailingLists,
  getTeamMailingLists,
  storeMemberDetails,
  subscribe,
  unsubscribe,
  removeMemberDetails
} = require('./SubscribeUtil')

async function subscribeEmployee(mailgun, employee) {
  team_name = await resolveTeamName(employee.team_id);
  return getAllMailingLists(mailgun)
      .then(mail_lists => getTeamMailingLists(team_name, mail_lists))
      .then(mail_lists => storeMemberDetails(mail_lists, employee.email))
      .then(mail_lists => subscribe(mailgun, mail_lists, employee))
      .catch(err => console.error(err));
}

async function unsubscribeEmployee(mailgun, employee, prev_team) {
  return getAllMailingLists(mailgun)
      .then(mail_lists => getTeamMailingLists(prev_team, mail_lists))
      .then(mail_lists => unsubscribe(mailgun, mail_lists, employee))
      .then(() => removeMemberDetails(employee.email))
      // whenever emp switch team, extra subs also go away
      .catch(err => console.error(err));
}


exports = {
  subscribeEmployee,
  unsubscribeEmployee
}