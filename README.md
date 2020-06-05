## Freshteam App Project

This app auto-syncs employee's email with their team email-groups. The features include
1. When a new employee is created, the employee gets subscribed to the respective team's email groups

2. When an existing employee changes their primary team, the app automatically unsubscribe the employee from previous team's email group and subscribes them to the new team's email groups

3. When an employee changes their official email, the previous email gets removed from all subscriptions and the new email automatically gets subscribed to all the email groups the previous email was subscribed initially.

### Other details
The app is integrated with mailgun email service.

Currently Freshteam doesn't support any frontend applications, therefore I had to map teams to mail groups over the team name. In future a frontend app can be provided to give user a more flexible mapping experience.

### Demo videos
part 1 -> https://youtu.be/21tPP3w8L14
part 2 -> https://youtu.be/MDzPZhz0ooM

### Takeaways
1. Understanding and developing serverless apps
2. Working with Email apis and Freshworks Development Kit
3. An in depth insight of Freshteam

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
