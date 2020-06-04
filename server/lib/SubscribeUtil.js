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

    return Promise.all(res).then(data => {
        return data;
    })
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

exports = {
    resolveTeamName,
    getAllMailingLists,
    getTeamMailingLists,
    subscribe,
    unsubscribe
}