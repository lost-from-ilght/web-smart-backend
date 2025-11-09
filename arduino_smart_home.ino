#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// ================= CONFIGURATION =================
const char* ssid = "MoLS Staff";
const char* password = "Staff@321$$";
const char* apiUrl = "https://web-smart-backend.onrender.com/api/room/d4a172af-579a-4cd8-80e3-1ec875ad71c1";

// ================= RELAY PIN MAPPING =================
// Living Room
#define RELAY_CHARGER 16   // GPIO16/D0
#define RELAY_DOOR    5    // GPIO5/D1
#define RELAY_FAN     4    // GPIO4/D2

// Kitchen
#define RELAY_STOVE   14   // GPIO14/D5
#define RELAY_OVEN    12   // GPIO12/D6
#define RELAY_FREEZER 15   // GPIO15/D8

// ================= GLOBALS =================
WiFiClientSecure client;

// ================= HELPER FUNCTIONS =================
bool isOn(JsonVariant value) {
  // Handle string values: "on", "off"
  if (value.is<const char*>()) {
    String s = value.as<const char*>();
    s.toLowerCase();
    return (s == "on" || s == "true" || s == "1");
  }
  // Handle numeric values: 1 = on, 0 = off
  if (value.is<int>()) {
    return value.as<int>() == 1;
  }
  // Handle boolean values
  if (value.is<bool>()) {
    return value.as<bool>();
  }
  // Default to off
  return false;
}

void setRelay(int pin, JsonVariant value, const char* name) {
  // Active LOW relay - read from COMMAND only (not activities)
  bool state = isOn(value);
  if (value.isNull()) {
    Serial.printf("   ⚠️ %s not found in command\n", name);
    return;
  }
  digitalWrite(pin, state ? LOW : HIGH);
  Serial.printf("   %s: %s\n", name, state ? "ON 🔆" : "OFF 💤");
}

// ================= SETUP =================
void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(RELAY_CHARGER, OUTPUT);
  pinMode(RELAY_DOOR, OUTPUT);
  pinMode(RELAY_FAN, OUTPUT);
  pinMode(RELAY_STOVE, OUTPUT);
  pinMode(RELAY_OVEN, OUTPUT);
  pinMode(RELAY_FREEZER, OUTPUT);

  // Turn all relays OFF initially
  digitalWrite(RELAY_CHARGER, HIGH);
  digitalWrite(RELAY_DOOR, HIGH);
  digitalWrite(RELAY_FAN, HIGH);
  digitalWrite(RELAY_STOVE, HIGH);
  digitalWrite(RELAY_OVEN, HIGH);
  digitalWrite(RELAY_FREEZER, HIGH);

  Serial.print("🌐 Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected!");
  Serial.print("IP Address: "); Serial.println(WiFi.localIP());
  
  client.setInsecure(); // Skip SSL certificate verification
}

// ================= LOOP =================
void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(client, apiUrl);
    http.setTimeout(10000); // 10 second timeout
    http.setReuse(false);

    Serial.println("\n🌐 Fetching data from server...");
    int httpCode = http.GET();
    
    Serial.printf("HTTP Response Code: %d\n", httpCode);
    
    if (httpCode == 200) {
      // Wait for data to be available
      int len = http.getSize();
      Serial.printf("Content Length: %d bytes\n", len);
      
      // Read the payload - wait a bit for data to arrive
      delay(100);
      String payload = http.getString();
      
      // If payload seems empty or too short, try reading from stream
      if (payload.length() == 0 || payload.length() < 10) {
        WiFiClient* stream = http.getStreamPtr();
        if (stream) {
          unsigned long timeout = millis();
          while (stream->available() == 0 && (millis() - timeout < 5000)) {
            delay(10);
          }
          
          payload = "";
          while (stream->available()) {
            payload += (char)stream->read();
          }
        }
      }

      Serial.printf("Payload length: %d bytes\n", payload.length());
      
      // Extract JSON from payload (in case there are HTTP headers)
      int jsonStart = payload.indexOf('{');
      if (jsonStart == -1) jsonStart = payload.indexOf('[');
      
      if (jsonStart > 0) {
        payload = payload.substring(jsonStart);
        Serial.println("⚠️ Removed HTTP headers, JSON starts at position");
      }
      
      if (payload.length() < 100) {
        Serial.print("Payload preview: ");
        Serial.println(payload);
      } else {
        Serial.print("Payload preview (first 200 chars): ");
        Serial.println(payload.substring(0, 200));
      }

      DynamicJsonDocument doc(16384);
      DeserializationError err = deserializeJson(doc, payload);

      if (err) {
        Serial.print("❌ JSON Parse Error: ");
        Serial.println(err.c_str());
        Serial.print("Payload length: ");
        Serial.println(payload.length());
        if (payload.length() > 0) {
          Serial.print("First 100 chars: ");
          Serial.println(payload.substring(0, 100));
        }
      } else {
        Serial.println("✅ JSON Parsed Successfully!");
        Serial.println("📦 Applying relay states...");

        // Handle both array and single object responses
        if (doc.is<JsonArray>()) {
          // Case: JSON is an array of rooms
          Serial.println("📋 Response is an array of rooms");
          for (JsonObject room : doc.as<JsonArray>()) {
            String roomName = room["name"].as<String>();
            
            // Ensure command object exists
            if (!room.containsKey("command")) {
              Serial.printf("⚠️ No 'command' found for room: %s\n", roomName.c_str());
              continue;
            }
            
            JsonObject cmd = room["command"]; // Read from COMMAND, not activities

            if (roomName == "Living Room") {
              Serial.println("---------------------------------");
              Serial.println("🏠 Living Room Summary (from COMMAND):");
              setRelay(RELAY_CHARGER, cmd["charger"], "Charger");
              setRelay(RELAY_DOOR, cmd["door"], "Door");
              setRelay(RELAY_FAN, cmd["fan"], "Fan");
            }

            else if (roomName == "Kitchen") {
              Serial.println("🍳 Kitchen Summary (from COMMAND):");
              setRelay(RELAY_STOVE, cmd["stove"], "Stove");
              setRelay(RELAY_OVEN, cmd["oven"], "Oven");
              setRelay(RELAY_FREEZER, cmd["freezer"], "Freezer");
            }
          }
        } else if (doc.is<JsonObject>()) {
          // Case: JSON is a single room object
          Serial.println("📋 Response is a single room object");
          JsonObject room = doc.as<JsonObject>();
          String roomName = room["name"].as<String>();
          
          if (!room.containsKey("command")) {
            Serial.printf("⚠️ No 'command' found for room: %s\n", roomName.c_str());
          } else {
            JsonObject cmd = room["command"]; // Read from COMMAND, not activities

            if (roomName == "Living Room") {
              Serial.println("---------------------------------");
              Serial.println("🏠 Living Room Summary (from COMMAND):");
              setRelay(RELAY_CHARGER, cmd["charger"], "Charger");
              setRelay(RELAY_DOOR, cmd["door"], "Door");
              setRelay(RELAY_FAN, cmd["fan"], "Fan");
            }

            else if (roomName == "Kitchen") {
              Serial.println("🍳 Kitchen Summary (from COMMAND):");
              setRelay(RELAY_STOVE, cmd["stove"], "Stove");
              setRelay(RELAY_OVEN, cmd["oven"], "Oven");
              setRelay(RELAY_FREEZER, cmd["freezer"], "Freezer");
            }
          }
        } else {
          Serial.println("❌ Unknown JSON structure");
        }

        Serial.println("✅ All relays updated successfully!");
        Serial.println("=================================");
        Serial.println();
      }
    } else {
      Serial.printf("❌ Connection failed (HTTP %d)\n", httpCode);
    }

    http.end();
  } else {
    Serial.println("🚫 WiFi disconnected, retrying...");
    WiFi.reconnect();
  }

  delay(8000); // Refresh every 8 seconds
}
