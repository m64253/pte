APP = app
LOCAL = http://admin:admin@127.0.0.1:5984/pte
REMOTE = https://*****:*****@picktheeuros.iriscouch.com/app

push-local:
	./node_modules/couchapp/bin.js push $(APP) $(LOCAL)

push-remote:
	./node_modules/couchapp/bin.js push $(APP) $(REMOTE)

.PHONY: push-local push-remote