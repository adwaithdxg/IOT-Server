#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// Update these with your network details
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "YOUR_MQTT_BROKER_IP";

WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println();

  if (String(topic) == "EQ_RPC/esp32") {
    Serial.print("Response from server: ");
    Serial.println(messageTemp);
  }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect with username and password
    if (client.connect("ESP32Client", "admin", "password")) {
      Serial.println("connected");
      client.subscribe("EQ_RPC/esp32");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - lastMsg > 2000) {
    lastMsg = now;
    
    // Example: Reading a sensor value
    value++;
    StaticJsonDocument<200> doc;
    doc["uuid"] = "esp32";
    doc["value"] = value;
    doc["status"] = "active";
    
    char buffer[256];
    serializeJson(doc, buffer);
    
    Serial.print("Publish message: ");
    Serial.println(buffer);
    client.publish("iot/sensors/esp32", buffer);
  }
}
