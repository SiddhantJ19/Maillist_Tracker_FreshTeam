// returns an object {"name": name}
async function resolveTeamName(team_id) {
    try {
        return await $db.get(`team_${team_id}`);
    } catch (error) {
        console.error(error);
    }
}

async function getAllMailingLists(mailgun) {
    return mailgun.lists().list();
}

async function getTeamMailingLists(team, mail_lists) {
    let res = mail_lists.items
        .filter(
            ml =>
                (((ml.name).toLowerCase() === 'all' ||
                    (ml.name).toLowerCase() === team.name)))
        .map(ml => ml['address']);
    return res;
}

async function subscribe(mailgun, mail_lists, employee) {

    let new_user = {
        subscribed: true,
        address: employee.email,
        name: employee.name,
        vars: { team_id: employee.team_id }
    }

    let res = mail_lists.map(async (ml) => {
        try {
            return await mailgun.lists(ml).members().create(new_user);
        } catch (error) {
            return error
        }
    });

    return Promise.all(res)
}

async function unsubscribe(mailgun, mail_lists, employee){
    let res =  mail_lists.map(async ml => {
        try {
            return await mailgun.lists(ml).members(employee.email).delete();
        } catch (error) {
            return error
        }
    });

    return Promise.all(res);
}


async function getSubcriptions(email) {
    return await $db.get(email);
}

async function subscribeEmail(mailgun, employee, mail_lists) {
    return storeMemberDetails(mail_lists, employee.email)
        .then((mail_lists) => subscribe(mailgun, mail_lists, employee))
        .catch(err => console.error(err));
}


async function storeMemberDetails(mail_lists, email){
    try {
        await $db.set(email, {subscriptions : mail_lists}, {ttl: -1});
        return mail_lists;
    } catch (error) {
        console.log(error)
    }
}

async function removeMemberDetails(email){
    let res =  await $db.delete(email);
    console.log(res);
    return 
}

exports = {
    resolveTeamName,
    getAllMailingLists,
    getTeamMailingLists,
    storeMemberDetails,
    subscribe,
    unsubscribe,
    removeMemberDetails,
    getSubcriptions,
    subscribeEmail
}