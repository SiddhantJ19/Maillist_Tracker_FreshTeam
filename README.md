## Freshteam App Project

This app auto-syncs employee's email with their team email-groups. The features include
1. When a new employee is created, the employee gets subscribed to the respective team's email groups

2. When an existing employee changes their primary team, the app automatically unsubscribe the employee from previous team's email group and subscribes them to the new team's email groups

3. When an employee changes their official email, the previous email gets removed from all subscriptions and the new email automatically gets subscribed to all the email groups the previous email was subscribed initially.

### Other details
The app is integrated with mailgun, an email service.
The app maps the team names to mail-group names.

### Project folder structure explained

    .
    ├── README.md                  This file.
    ├── config                     Installation parameter configs.
    │   ├── iparams.json           Installation parameter config in English language.
    │   └── iparam_test_data.json  Installation parameter data for local testing.
    └── manifest.json              Project manifest.
    └── server                     Business logic for remote request and event handlers.
        ├── lib
        │   └── handle-response.js
        ├── server.js
        └── test_data
            └── onEmployeeCreate.json
