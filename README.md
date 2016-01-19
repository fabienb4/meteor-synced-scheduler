# fabienb4:synced-scheduler

> **This package is no longer maintained.**

A simple server-side synced scheduler for Meteor. Define functions to run every/in X seconds. Schedules are 'synchronized', meaning they won't run twice if your deployment consist of multiple servers.

> Based on `percolate:synced-cron`

### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)
- [License](#license)
- [Contributing](#contributing)

### Installation

In your Meteor app directory:

```
$ meteor add fabienb4:synced-scheduler
```

### Usage

**Add a schedule:**
```js
SyncedScheduler.add({
  name: "schedule-name",
  schedule: 10,// every ten seconds
  job() {
    console.log("schedule ran");
  }
});
```

**Add a single-time schedule (run only once):**
```js
SyncedScheduler.add({
  name: "schedule-name",
  schedule: 10,// in ten seconds
  job() {
    console.log("single-time schedule ran");
    SyncedScheduler.remove("schedule-name");
  }
});
```

**Remove a schedule:**
```js
SyncedScheduler.remove("schedule-name");
```

**Start processing schedules:**
```js
SyncedScheduler.start();
```

**Remove schedules and stop processing new ones:**
```js
SyncedScheduler.stop();
```

### Example

An simple example of what can be achieved with SyncedScheduler. The code is highly incomplete & simplified, but it should be enough to get how it can be used! There are many other possibilities!

Uses EventEmitter with SyncedScheduler to allow sending of friend invitations that expire after a given time.

```js
// ...code for FriendEvent emitter (lepozepo:streams can be used for that)...

Friends = new Mongo.Collection("friends");

// server-side only
Friends.sendInvitation = function(fromId, newFriendName) {
  let newFriend = Meteor.users.findOne({ username: newFriendName }, { fields: { _id: 1 } });

  // ...checks...

  FriendEvent.emit("friend-invite-" + newFriend._id, fromId);

  SyncedScheduler.add({
    name: "friend-invite-" + newFriend._id,
    schedule: 60,// 60 seconds
    job() {
      FriendEvent.emit("friend-invite-" + newFriend._id, null);

      SyncedScheduler.remove("friend-invite-" + newFriend._id);
    }
  });
}

// ...server method for sendInvitation...

// ...client code to call sendInvitation using a server methods...

// client-side only
Template.friends.onRendered(function() {
  FriendEvent.on("friend-invite-" + Meteor.userId(), fromId => {
    if (fromId === null) {
      delete Session.keys.showFriendInvite;
    } else {
      // in this context, it is better to use `u2622:persistent-session` here to avoid clearing of values on refresh
      Session.set("showFriendInvite", fromId);
    }
  });
});
```

### License

MIT

### Contributing

Anyone is welcome to contribute. Fork, make your changes (test them!), and then submit a pull request.

Bitcoin: `34o6GtZPvVXparT46Zw2kfdxex2SWRpkGS`

[![Support via Gratipay](https://cdn.rawgit.com/gratipay/gratipay-badge/2.3.0/dist/gratipay.svg)](https://gratipay.com/fabienb4/)
