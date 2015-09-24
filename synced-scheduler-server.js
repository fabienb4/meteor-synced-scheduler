SyncedScheduler = {
  _entries: {},
  running: false
};

/**
 * Schedule en entry.
 * @param {Object} entry The entry object.
 */
var scheduleEntry = function(entry) {
  var schedule = entry.schedule * 1000;

  entry._timer = Meteor.setInterval(entry.job, schedule);
};

/**
 * @summary Add an entry to the SyncedScheduler.
 * @locus Server
 * @param {Object} entry The entry object.
 */
SyncedScheduler.add = function(entry) {
  check(entry.name, String);
  check(entry.schedule, Number);
  check(entry.job, Function);

  if (entry.schedule < 1) {
    throw new Error("invalid-schedule");
  }

  // check for double entries
  if (! this._entries[entry.name]) {
    this._entries[entry.name] = entry;

    // if cron is already running, start directly.
    if (this.running) {
      scheduleEntry(entry);
    }
  }
};

/**
 * @summary Remove an entry from the SyncedScheduler.
 * @locus Server
 * @param  {String} entryName The name of the entry to remove.
 */
SyncedScheduler.remove = function(entryName) {
  let entry = this._entries[entryName];

  if (entry) {
    if (entry._timer) {
      Meteor.clearInterval(entry._timer);
    }

    delete this._entries[entryName];
  }
};

/**
 * @summary Start SyncedScheduler and run all jobs.
 * @locus Server
 */
SyncedScheduler.start = function() {
  Meteor.startup(() => {
    _.each(this._entries, entry => {
      scheduleEntry(entry);
    });

    this.running = true;
  });
};

/**
 * @summary Stop SyncedScheduler & clean up.
 * @locus Server
 */
SyncedScheduler.stop = function() {
  _.each(this._entries, (entry, name) => {
    SyncedScheduler.remove(name);
  });

  this.running = false;
};
