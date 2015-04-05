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
  var self = this;

  check(entry.name, String);
  check(entry.schedule, Number);
  check(entry.job, Function);

  if (entry.schedule < 1) {
    throw new Error("invalid-schedule");
  }

  // check for double entries
  if (! self._entries[entry.name]) {
    self._entries[entry.name] = entry;

    // if cron is already running, start directly.
    if (self.running) {
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
  var self  = this;
  var entry = self._entries[entryName];

  if (entry) {
    if (entry._timer) {
      Meteor.clearInterval(entry._timer);
    }

    delete self._entries[entryName];
  }
};

/**
 * @summary Start SyncedScheduler and run all jobs.
 * @locus Server
 */
SyncedScheduler.start = function() {
  var self = this;

  Meteor.startup(function() {
    _.each(self._entries, function(entry) {
      scheduleEntry(entry);
    });

    self.running = true;
  });
};

/**
 * @summary Stop SyncedScheduler & clean up.
 * @locus Server
 */
SyncedScheduler.stop = function() {
  var self = this;

  _.each(self._entries, function(entry, name) {
    SyncedScheduler.remove(name);
  });

  self.running = false;
};
