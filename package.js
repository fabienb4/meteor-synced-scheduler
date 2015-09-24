Package.describe({
  name: 'fabienb4:synced-scheduler',
  version: '0.2.0',
  // Brief, one-line summary of the package.
  summary: 'A simple server-side synced scheduler for Meteor.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/fabienb4/meteor-synced-scheduler.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.1');

  api.use('ecmascript', 'server');

  api.addFiles('synced-scheduler-server.js', 'server');

  api.export('SyncedScheduler', 'server');
});
