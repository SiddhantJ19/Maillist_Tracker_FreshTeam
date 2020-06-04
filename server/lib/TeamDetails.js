function getAllTeamDetails(iparams, domain){
    let headers = {
        "Authorization": `Bearer ${iparams.freshteamApiToken}` ,
        accept: "application/json"  
    }
    let url = domain + '/api/teams';

    let res =  $request.get(url, {headers: headers})
    .then(
        function(data){
            let res = JSON.parse(data.response)
            .map((team) => {
                return {"id": team.id,"name":team.name};
            })
            return res;
        },
        function(error){
            return error
        });

    return Promise.resolve(res);
}

function storeTeamdetails(teams){
    console.log(teams);
    let res = teams.map(team => {
        return $db.set(`team_${team.id}`, {name: (team.name).toLowerCase()}, {ttl : -1})
        .done(function(data){
            return data;
        })
        .fail(function(err){
            return err;
        })
    })
    return Promise.resolve(res);
}

exports = {
    getAllTeamDetails,
    storeTeamdetails
}