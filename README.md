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

* show the last fetch stats
* fill in the index placeholders
* sort on the client side? 
* allow specific start time selection