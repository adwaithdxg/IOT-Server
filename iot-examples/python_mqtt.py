import paho.mqtt.client as mqtt
import time
import json

# MQTT Broker Settings
BROKER = "localhost" 
PORT = 1884
TOPIC_PUB = "iot/sensors/python_client"
TOPIC_SUB = "iot/status/#"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!")
        client.subscribe(TOPIC_SUB)
    else:
        print("Failed to connect, return code %d\n", rc)

def on_message(client, userdata, msg):
    print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")

def main():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    try:
        client.connect(BROKER, PORT, 60)
    except Exception as e:
        print(f"Connection failed: {e}")
        return

    client.loop_start()

    try:
        while True:
            payload = json.dumps({"temperature": 25.5, "humidity": 60})
            print(f"Publishing: {payload} to {TOPIC_PUB}")
            client.publish(TOPIC_PUB, payload)
            time.sleep(5)
    except KeyboardInterrupt:
        print("Disconnecting...")
        client.loop_stop()
        client.disconnect()

if __name__ == '__main__':
    main()
