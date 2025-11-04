#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// ===== WiFi =====
const char* ssid = "MoLS Staff";
const char* password = "Staff@321$$";

// ===== Backend =====
const char* serverURL = "https://web-smart-backend.onrender.com/api/room/d4a172af-579a-4cd8-80e3-1ec875ad71c1";

// ===== Room IDs =====
const char* LIVING_ROOM_ID = "a60349d9-9860-4f77-9900-95c027883fa1";
const char* KITCHEN_ID     = "d9b29bd0-f298-4138-b851-a7dbc20d0595";

// ===== Relay Pins (for reference) =====
#define LR_CENTER_LIGHT 16
#define LR_SPOT_LIGHT    5
#define LR_SHADOW_LIGHT  4
#define LR_DINING_LIGHT  0
#define LR_TV            2

#define K_CENTER_LIGHT  14
#define K_PLUG          12
#define K_STOVE         15

// ===== Setup =====
void setup() {
  Serial.begin(115200);
  delay(100);

  WiFi.begin(ssid, password);
  Serial.print("🔌 Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi Connected!");
  Serial.print("IP: "); Serial.println(WiFi.localIP());
}

// ===== Convert state string/number to ON/OFF =====
String stateToString(JsonVariant val) {
  if (!val.isNull()) {
    if (val.is<bool>()) return val.as<bool>() ? "ON" : "OFF";
    if (val.is<int>())  return val.as<int>() ? "ON" : "OFF";
    if (val.is<const char*>()) {
      String s = val.as<const char*>();
      s.toLowerCase();
      if (s == "on" || s == "true" || s == "1") return "ON";
      else return "OFF";
    }
  }
  return "OFF";
}

// ===== Fetch backend and print device statuses =====
void fetchAndPrintStatus() {
  if (WiFi.status() != WL_CONNECTED) return;

  WiFiClientSecure client;
  client.setInsecure(); // ignore SSL cert
  client.setTimeout(20000); // 20 second timeout for SSL connections
  
  HTTPClient https;
  https.begin(client, serverURL);
  https.setTimeout(20000); // 20 second timeout for HTTP client
  https.setReuse(false); // Don't reuse connection to avoid issues
  
  // Add headers to ensure proper response
  https.addHeader("Accept", "application/json");
  https.addHeader("Connection", "close");
  
  int httpCode = https.GET();

  if (httpCode == 200) {
    Serial.printf("\n📩 Data Received (HTTP %d)\n", httpCode);

    // Get content length if available
    int contentLength = https.getSize();
    Serial.print("📦 Content-Length: ");
    Serial.print(contentLength);
    Serial.println(" bytes");

    // Read stream in chunks to ensure complete data
    String payload = "";
    payload.reserve(contentLength > 0 ? contentLength + 1024 : 16384); // Pre-allocate if we know size
    WiFiClient *stream = https.getStreamPtr();
    
    unsigned long startTime = millis();
    unsigned long lastDataTime = millis();
    const unsigned long maxWaitTime = 15000; // 15 seconds max wait
    const size_t bufferSize = 512; // Read in 512 byte chunks
    char buffer[bufferSize + 1]; // +1 for null terminator
    
    while (true) {
      size_t available = stream->available();
      if (available > 0) {
        size_t toRead = (available > bufferSize) ? bufferSize : available;
        size_t bytesRead = stream->readBytes(buffer, toRead);
        if (bytesRead > 0) {
          buffer[bytesRead] = '\0'; // Null terminate for String
          payload.concat(buffer);
          lastDataTime = millis(); // Reset timeout when we get data
        }
      } else {
        // If no data available and we've waited 2 seconds since last data, assume complete
        if (millis() - lastDataTime > 2000) {
          break;
        }
      }
      
      // Safety timeout - don't wait more than maxWaitTime total
      if (millis() - startTime > maxWaitTime) {
        Serial.println("⚠️ Timeout while reading stream");
        break;
      }
      
      delay(1);
    }
    
    Serial.print("📦 Payload read: ");
    Serial.print(payload.length());
    Serial.println(" bytes");

    // Check if payload seems complete (ends with ])
    if (payload.length() > 0 && payload.charAt(payload.length() - 1) != ']') {
      Serial.println("⚠️ Warning: Payload may be incomplete (doesn't end with ']')");
      Serial.print("Last 50 chars: ");
      Serial.println(payload.substring(payload.length() - 50));
    }

    // Calculate appropriate buffer size (JSON needs ~1.3x the raw size)
    size_t jsonSize = payload.length() * 1.3 + 8192; // Add 8KB safety margin
    if (jsonSize > 65536) jsonSize = 65536; // Cap at 64KB for ESP8266
    
    Serial.print("📦 Allocating JSON buffer: ");
    Serial.print(jsonSize);
    Serial.println(" bytes");
    
    DynamicJsonDocument doc(jsonSize);
    
    DeserializationError err = deserializeJson(doc, payload);

    if (err) {
      Serial.print("❌ JSON Parse Error: ");
      Serial.println(err.c_str());
      Serial.print("Error code: ");
      Serial.println(err.code());
      Serial.print("Payload length: ");
      Serial.println(payload.length());
      Serial.print("Payload preview (first 500 chars): ");
      Serial.println(payload.substring(0, 500));
      Serial.print("Payload ending (last 100 chars): ");
      Serial.println(payload.substring(payload.length() - 100));
      https.end();
      return;
    }

    Serial.println("✅ JSON parsed successfully.\n===== DEVICE STATUS =====");

    // Iterate rooms
    for (JsonObject room : doc.as<JsonArray>()) {
      const char* roomId = room["id"];
      const char* roomName = room["name"];
      JsonObject command = room["command"];
      JsonObject divider = room["divider"];

      // Only print Living Room and Kitchen
      if (strcmp(roomId, LIVING_ROOM_ID) == 0 || strcmp(roomId, KITCHEN_ID) == 0) {
        Serial.printf("\n🏠 %s:\n", roomName);

        // Print command devices
        for (JsonPair kv : command) {
          const char* name = kv.key().c_str();
          String state = stateToString(kv.value());
          Serial.printf("   🔹 %s: %s\n", name, state.c_str());
        }

        // Print divider devices
        for (JsonPair kv : divider) {
          const char* name = kv.key().c_str();
          if (strcmp(name, "room_id") == 0 || strcmp(name, "id") == 0) continue;
          String state = stateToString(kv.value());
          Serial.printf("   🔹 %s: %s\n", name, state.c_str());
        }
      }
    }

    Serial.println("==========================\n");
  }
  else {
    Serial.printf("❌ HTTP Error: %d\n", httpCode);
  }

  https.end();
}

// ===== Loop =====
void loop() {
  fetchAndPrintStatus();
  delay(8000); // every 8 seconds
}
