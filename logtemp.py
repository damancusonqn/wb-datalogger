#!/usr/bin/env python
import sys
import json
from datetime import datetime
import paho.mqtt.client as mqtt
from requests import get
from pymongo import MongoClient

##Connection to the DB:
client = MongoClient('mongodb://localhost:3001/') #created by Meteor
#db to use
db = client['meteor']

#get a collection
temp = db['temp']

dev_id = "#"  #all if no argument is given (to check the broker healt)


# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    #print("Connected with result code %d" % rc)

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    if (len(sys.argv) > 1):
        dev_id = str(sys.argv[1])
        client.subscribe("/v1/" + dev_id + "/#")
    else:
        client.subscribe("/v1/#")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    data = json.loads(msg.payload)

    dt = datetime.utcfromtimestamp(data['ts'] / 1000.).isoformat()
    del data['ts']
    #print('%s %s %s' % (msg.topic, json.dumps(data), dt))

    #temp.insert(data['temp'])

    #print('%s %s %s' % (msg.topic, dt, json.dumps(data)))
    try:
        if 'temp' in data:
            tempObj = {'time': dt, 'temp' : data['temp']}
        if 'val' in data:
            tempObj = {'time': dt, 'batt' : data['val']}
        print tempObj
        #inserts the new data to the db
        temp.insert(tempObj)
    except:
        print "Oops!  Key not found"
        print ('%s %s %s' % (msg.topic, dt, json.dumps(data)))

def show_incoming_data():

    if (len(sys.argv) > 1):
        print 'ArgLength:', len(sys.argv)
        print 'DeviceID:', sys.argv[1]
        dev_id = sys.argv[1]

    client = mqtt.Client(client_id="danielM")
    client.on_connect = on_connect
    client.on_message = on_message

    client.username_pw_set("relayr", "YOUR_PASSWORD")

    client.tls_set("/Users/dani/code/certs/relayr.crt")
    #client.tls_set("~/code/certs/relayr.crt", certfile=None, keyfile=None, cert_reqs=ssl.CERT_REQUIRED,
    #                tls_version=ssl.PROTOCOL_TLSv1, ciphers=None)
    client.tls_insecure_set(True)

    client.connect("mqtt.relayr.io", 8883, 60)

    try:
        client.loop_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    #list_user_devices()
    show_incoming_data()
