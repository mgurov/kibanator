# kibanator

Like kibana, but with uglier and less flexible UI. 

Features (future): 

* Acknowledge and hide log lines seen. Show me what's new!
* Group known messages to declutter the view. This one should be more flexible than kibana.
* TTL for the "ignore" filter, e.g. "I know this issue is to be fixed in a day. Keep bugging me afterwards". 
* First class SCM configuration support. 

### Similar art

* https://github.com/sw-jung/kibana_notification_center kibana plugin based on [es watches](https://www.elastic.co/guide/en/watcher/current/introduction.html) I guess

### WIP TODO

* client-side filters
* multi-app
* warning on hitting the 10K limit