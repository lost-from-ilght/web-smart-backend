# Arduino Smart Home Controller Setup Guide

## Hardware Requirements

1. **ESP8266 or ESP32** (WiFi-enabled microcontroller)
2. **Relay Module** (8-channel or 16-channel recommended)
3. **Power Supply** (5V for ESP8266, 3.3V/5V for ESP32)
4. **Breadboard and jumper wires**

## Libraries Required

Install these libraries from Arduino Library Manager:

1. **ArduinoJson** (by Benoit Blanchon) - Version 6.x or 7.x
2. **ESP8266WiFi** (built-in for ESP8266)
3. **WiFi** (built-in for ESP32)

For ESP8266:
- Go to Tools > Board > Boards Manager
- Search for "ESP8266" and install "ESP8266 by ESP8266 Community"

For ESP32:
- Go to Tools > Board > Boards Manager  
- Search for "ESP32" and install "ESP32 by Espressif Systems"

## Configuration Steps

### 1. Update WiFi Credentials

Edit these lines in `arduino_smart_home.ino`:

```cpp
const char* ssid = "YOUR_WIFI_SSID";           // Your WiFi SSID
const char* password = "YOUR_WIFI_PASSWORD";    // Your WiFi Password
```

### 2. Configure Relay Pins

Update the `roomConfigs[]` array with your actual relay pin numbers:

```cpp
RoomRelays roomConfigs[] = {
  {
    "a60349d9-9860-4f77-9900-95c027883fa1", // Living Room
    {2, 4, 5, 18, 19, 21, 22, 23}, // Your relay pins
    {"mainLight", "sideLight", "tv", "music", "charger", "fan", "ac", "door"}
  },
  // Add more rooms...
};
```

**Pin Number Reference:**
- **ESP8266**: Use D1, D2, D3, D4, D5, D6, D7, D8
- **ESP32**: Use GPIO numbers like 2, 4, 5, 18, 19, 21, 22, 23

### 3. Relay Module Connection

Most relay modules are **LOW triggered** (active LOW), meaning:
- `LOW` = Relay ON
- `HIGH` = Relay OFF

If your relays are LOW triggered, uncomment this line in the `setRelay()` function:

```cpp
void setRelay(int pin, bool state) {
  // digitalWrite(pin, state);  // Comment this for LOW triggered
  digitalWrite(pin, !state);    // Uncomment for LOW triggered relays
}
```

### 4. Device Type Mapping

The code automatically maps devices based on their type:

- **Switches**: Control lights with variable brightness (0-100%)
- **OnOffs**: Simple on/off devices (stove, washing machine, etc.)
- **ACs**: Air conditioners (variable control 0-100%)
- **TVs**: Television power control
- **Musics**: Music device control
- **Commands**: Direct command fields (door, smartCurtain, etc.)

### 5. Adjust Polling Interval

Change how often the Arduino checks for new commands:

```cpp
const unsigned long POLL_INTERVAL = 2000; // Poll every 2 seconds (2000ms)
```

## Wiring Diagram

```
ESP8266/ESP32    Relay Module
--------         -----------
GPIO 2   ------> IN1
GPIO 4   ------> IN2
GPIO 5   ------> IN3
...
GND      ------> GND
VCC      ------> VCC (5V for relay module)
```

**Important:** 
- Relay module VCC should be connected to 5V (or 3.3V for some modules)
- Use a separate power supply for the relay module if needed
- Connect relay NO (Normally Open) terminals to your appliances
- Connect relay COM (Common) terminals to power source

## API Endpoint

The Arduino connects to:
```
https://web-smart-backend.onrender.com/api/room/d4a172af-579a-4cd8-80e3-1ec875ad71c1
```

This endpoint returns all rooms with their commands, switches, onoffs, acs, etc.

## How It Works

1. **WiFi Connection**: Connects to your WiFi network
2. **Polling**: Fetches commands from backend every 2 seconds (configurable)
3. **Parsing**: Parses JSON response and extracts device states
4. **Control**: Updates relay states based on command values:
   - String values: "on" = HIGH, "off" = LOW
   - Numeric values: >0 = HIGH, 0 = LOW
   - Boolean values: true = HIGH, false = LOW
5. **Logging**: Serial monitor shows all device state changes

## Testing

1. Upload the code to your ESP8266/ESP32
2. Open Serial Monitor (115200 baud)
3. Watch for connection status and command processing
4. Control devices from the web app
5. Verify relay states change accordingly

## Troubleshooting

### WiFi Connection Issues
- Check SSID and password
- Ensure 2.4GHz WiFi (ESP8266/ESP32 don't support 5GHz)
- Check WiFi signal strength

### No Commands Received
- Verify backend URL is accessible
- Check Serial monitor for HTTP error codes
- Verify home_id is correct

### Relays Not Responding
- Check relay module power supply
- Verify pin connections
- Test relays manually
- Check if relays are LOW or HIGH triggered

### JSON Parsing Errors
- Increase `DynamicJsonDocument` size if needed
- Check Serial monitor for JSON errors
- Verify backend response format

## Room IDs Reference

Based on your database:

- **Living Room**: `a60349d9-9860-4f77-9900-95c027883fa1`
- **Kitchen**: `d9b29bd0-f298-4138-b851-a7dbc20d0595`
- **Bath Room**: `48fdc344-070c-4e30-b724-5d0c92ab36bd`
- **Outdoor**: `c0a01acf-0499-417c-9789-e61bb0e41fa9`
- **Store**: `b5d2c17a-2619-481e-b60f-a2dd4bb79452`
- **Master Bed Room**: `716a5968-7c6e-42be-b6b9-ed8673e5ac00`
- **2nd Bed Room**: `8e044513-52e4-48af-b42e-8dd906c9d861`
- **3rd Bed Room**: `b91902e1-efe9-4aac-b029-7edd4bded6f2`
- **4th Bed room**: `01205450-f92f-4cb8-ba3c-13211dc1959f`

## Advanced Features

### PWM Dimming (Optional)

To enable dimming for switches, uncomment PWM code sections. You'll need:
- PWM-capable pins on your board
- Dimmer modules or MOSFETs for dimmable LEDs
- Proper wiring for PWM control

### Multiple Arduino Units

You can run multiple Arduino units, each handling different rooms by:
1. Filtering rooms by room_id in the code
2. Assigning different home_ids (if using separate homes)
3. Using room-specific relay pin mappings

## Security Notes

- Consider adding authentication for production use
- Use HTTPS (requires additional SSL certificate handling)
- Add error handling and retry logic
- Implement watchdog timer for reliability


