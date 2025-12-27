# Native Android Print Bridge App - Reference Guide

## Overview

A simple Android app that:
1. Receives print jobs from your web app (via deep link, intent, or local server)
2. Connects to P-50 via Bluetooth
3. Sends ESC/POS commands to print receipts

---

## Time Estimate by Experience Level

| Experience | Time | Notes |
|------------|------|-------|
| **Beginner** (learning Java/Android) | 4-8 weeks | Need to learn Android basics, Bluetooth API, ESC/POS |
| **Intermediate** (some Android experience) | 1-2 weeks | Familiar with Android, need to learn Bluetooth printing |
| **Experienced** (Android + Bluetooth) | 2-4 days | Just implementation time |

---

## Key Components & Complexity

| Component | Complexity | Time (Intermediate) |
|-----------|------------|---------------------|
| Bluetooth device scanning/pairing | Medium | 1-2 days |
| ESC/POS command formatting | Medium | 1-2 days |
| Web ↔ App communication (Intent/URL scheme) | Low | 0.5 day |
| Receipt data parsing (JSON) | Low | 0.5 day |
| UI (printer selection, settings) | Low | 1 day |
| Testing & debugging | Medium | 1-2 days |
| **Total** | | **5-8 days** |

---

## Alternative: Use Existing Open-Source

Instead of building from scratch, consider:

### 1. Fork RawBT (Recommended)
- **GitHub**: `niclasku/RawBT`
- Already handles Bluetooth printing
- Just add your web integration
- Open source, customizable

### 2. Use Print Intent
- Your web app triggers Android's print system
- No custom app needed if user installs any Bluetooth print service (like RawBT)

---

## Implementation Guide

### Project Structure

```
MzigoPrintBridge/
├── app/
│   ├── src/main/
│   │   ├── java/com/mzigo/printbridge/
│   │   │   ├── MainActivity.java
│   │   │   ├── BluetoothPrinter.java
│   │   │   ├── EscPosCommands.java
│   │   │   └── ReceiptParser.java
│   │   ├── res/
│   │   │   ├── layout/
│   │   │   │   └── activity_main.xml
│   │   │   └── values/
│   │   │       └── strings.xml
│   │   └── AndroidManifest.xml
│   └── build.gradle
└── build.gradle
```

### AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.mzigo.printbridge">

    <!-- Bluetooth Permissions -->
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
    
    <!-- For Android 12+ -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.MzigoPrintBridge">
        
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            
            <!-- Deep link handler for web app -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="mzigo" android:host="print" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### MainActivity.java

```java
package com.mzigo.printbridge;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import org.json.JSONObject;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Set;

public class MainActivity extends AppCompatActivity {
    
    private static final int REQUEST_BLUETOOTH_PERMISSIONS = 1;
    private BluetoothAdapter bluetoothAdapter;
    private BluetoothPrinter printer;
    private String selectedPrinterAddress;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        printer = new BluetoothPrinter();
        
        // Check permissions
        checkBluetoothPermissions();
        
        // Setup UI
        setupPrinterList();
        
        // Handle intent from web app
        handleIntent(getIntent());
    }
    
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIntent(intent);
    }
    
    private void handleIntent(Intent intent) {
        Uri data = intent.getData();
        if (data != null && "mzigo".equals(data.getScheme()) && "print".equals(data.getHost())) {
            try {
                String receiptJson = data.getQueryParameter("data");
                if (receiptJson != null) {
                    receiptJson = URLDecoder.decode(receiptJson, "UTF-8");
                    printReceipt(receiptJson);
                }
            } catch (Exception e) {
                Toast.makeText(this, "Error parsing print data: " + e.getMessage(), Toast.LENGTH_LONG).show();
            }
        }
    }
    
    private void checkBluetoothPermissions() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT) 
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                new String[]{
                    Manifest.permission.BLUETOOTH_CONNECT,
                    Manifest.permission.BLUETOOTH_SCAN,
                    Manifest.permission.ACCESS_FINE_LOCATION
                },
                REQUEST_BLUETOOTH_PERMISSIONS);
        }
    }
    
    private void setupPrinterList() {
        ListView listView = findViewById(R.id.printer_list);
        Button refreshBtn = findViewById(R.id.btn_refresh);
        
        refreshBtn.setOnClickListener(v -> loadPairedDevices());
        loadPairedDevices();
        
        listView.setOnItemClickListener((parent, view, position, id) -> {
            BluetoothDevice device = (BluetoothDevice) parent.getItemAtPosition(position);
            selectedPrinterAddress = device.getAddress();
            Toast.makeText(this, "Selected: " + device.getName(), Toast.LENGTH_SHORT).show();
            
            // Save preference
            getSharedPreferences("printer", MODE_PRIVATE)
                .edit()
                .putString("address", selectedPrinterAddress)
                .apply();
        });
    }
    
    private void loadPairedDevices() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.BLUETOOTH_CONNECT) 
                != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        
        Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
        ArrayList<BluetoothDevice> deviceList = new ArrayList<>(pairedDevices);
        
        ArrayAdapter<BluetoothDevice> adapter = new ArrayAdapter<>(this,
            android.R.layout.simple_list_item_1, deviceList);
        
        ListView listView = findViewById(R.id.printer_list);
        listView.setAdapter(adapter);
    }
    
    private void printReceipt(String jsonData) {
        // Get saved printer address
        String printerAddress = getSharedPreferences("printer", MODE_PRIVATE)
            .getString("address", selectedPrinterAddress);
        
        if (printerAddress == null) {
            Toast.makeText(this, "Please select a printer first", Toast.LENGTH_LONG).show();
            return;
        }
        
        new Thread(() -> {
            try {
                // Parse receipt JSON
                JSONObject receipt = new JSONObject(jsonData);
                
                // Convert to ESC/POS commands
                byte[] printData = EscPosCommands.fromJson(receipt);
                
                // Connect and print
                printer.connect(printerAddress);
                printer.print(printData);
                printer.disconnect();
                
                runOnUiThread(() -> 
                    Toast.makeText(this, "Receipt printed!", Toast.LENGTH_SHORT).show()
                );
                
            } catch (Exception e) {
                runOnUiThread(() -> 
                    Toast.makeText(this, "Print error: " + e.getMessage(), Toast.LENGTH_LONG).show()
                );
            }
        }).start();
    }
}
```

### BluetoothPrinter.java

```java
package com.mzigo.printbridge;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;

import java.io.IOException;
import java.io.OutputStream;
import java.util.UUID;

public class BluetoothPrinter {
    
    // Standard SPP UUID for Bluetooth serial communication
    private static final UUID SPP_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
    
    private BluetoothSocket socket;
    private OutputStream outputStream;
    
    public void connect(String macAddress) throws IOException {
        BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
        BluetoothDevice device = adapter.getRemoteDevice(macAddress);
        
        socket = device.createRfcommSocketToServiceRecord(SPP_UUID);
        socket.connect();
        outputStream = socket.getOutputStream();
    }
    
    public void print(byte[] data) throws IOException {
        if (outputStream != null) {
            outputStream.write(data);
            outputStream.flush();
        }
    }
    
    public void disconnect() {
        try {
            if (outputStream != null) {
                outputStream.close();
            }
            if (socket != null) {
                socket.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### EscPosCommands.java

```java
package com.mzigo.printbridge;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

public class EscPosCommands {
    
    // ESC/POS Command Constants
    public static final byte[] INIT = {0x1B, 0x40};                    // Initialize printer
    public static final byte[] ALIGN_LEFT = {0x1B, 0x61, 0x00};        // Left align
    public static final byte[] ALIGN_CENTER = {0x1B, 0x61, 0x01};      // Center align
    public static final byte[] ALIGN_RIGHT = {0x1B, 0x61, 0x02};       // Right align
    public static final byte[] BOLD_ON = {0x1B, 0x45, 0x01};           // Bold on
    public static final byte[] BOLD_OFF = {0x1B, 0x45, 0x00};          // Bold off
    public static final byte[] DOUBLE_HEIGHT = {0x1B, 0x21, 0x10};     // Double height
    public static final byte[] NORMAL_SIZE = {0x1B, 0x21, 0x00};       // Normal size
    public static final byte[] CUT_PAPER = {0x1D, 0x56, 0x00};         // Full cut
    public static final byte[] FEED_LINE = {0x0A};                      // Line feed
    public static final byte[] FEED_LINES_3 = {0x1B, 0x64, 0x03};      // Feed 3 lines
    
    /**
     * Convert receipt JSON to ESC/POS byte array
     */
    public static byte[] fromJson(JSONObject receiptData) throws Exception {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        
        // Initialize printer
        buffer.write(INIT);
        buffer.write(ALIGN_LEFT);
        
        // Get receipt array
        JSONArray receipt = receiptData.getJSONArray("receipt");
        
        for (int i = 0; i < receipt.length(); i++) {
            JSONObject item = receipt.getJSONObject(i);
            
            String preText = item.optString("pre-text", "");
            String content = item.optString("content", "");
            boolean isBold = item.optBoolean("is_bold", false);
            String textSize = item.optString("text_size", "normal");
            
            // Set text style
            if (isBold) {
                buffer.write(BOLD_ON);
            }
            
            if ("big".equals(textSize)) {
                buffer.write(DOUBLE_HEIGHT);
            }
            
            // Write text
            String line = preText + content;
            buffer.write(line.getBytes(StandardCharsets.UTF_8));
            buffer.write(FEED_LINE);
            
            // Reset style
            if (isBold) {
                buffer.write(BOLD_OFF);
            }
            if ("big".equals(textSize)) {
                buffer.write(NORMAL_SIZE);
            }
        }
        
        // Feed paper and cut
        buffer.write(FEED_LINES_3);
        buffer.write(CUT_PAPER);
        
        return buffer.toByteArray();
    }
}
```

### activity_main.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Mzigo Print Bridge"
        android:textSize="24sp"
        android:textStyle="bold"
        android:layout_marginBottom="16dp" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Select a printer:"
        android:textSize="16sp"
        android:layout_marginBottom="8dp" />

    <Button
        android:id="@+id/btn_refresh"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Refresh Devices"
        android:layout_marginBottom="8dp" />

    <ListView
        android:id="@+id/printer_list"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Tap a printer to select it as default"
        android:textSize="12sp"
        android:textColor="#666666"
        android:layout_marginTop="8dp" />

</LinearLayout>
```

---

## Web App Integration

### Add to your receipt-preview.tsx

Add a new print option that triggers the Android app:

```typescript
const handlePrintViaBridge = () => {
  if (!data) return;
  
  const encodedData = encodeURIComponent(JSON.stringify(data));
  const bridgeUrl = `mzigo://print?data=${encodedData}`;
  
  // Try to open native app
  window.location.href = bridgeUrl;
  
  // Fallback after timeout
  setTimeout(() => {
    toast.info("Print Bridge app not found", {
      description: "Install the Mzigo Print Bridge app to print via Bluetooth",
    });
  }, 2000);
};
```

### Add dropdown option

```tsx
<DropdownMenuItem onClick={handlePrintViaBridge}>
  <DevicePhoneMobileIcon className="mr-2 h-4 w-4" />
  Print via Bridge App
</DropdownMenuItem>
```

---

## Build & Install

### Using Android Studio

1. Create new project with "Empty Activity"
2. Copy the files above into appropriate locations
3. Build → Generate Signed APK
4. Transfer APK to phone and install

### Using Command Line

```bash
# In project directory
./gradlew assembleDebug

# APK will be at:
# app/build/outputs/apk/debug/app-debug.apk
```

---

## Testing

1. Install the APK on your Android phone
2. Open the app and grant Bluetooth permissions
3. Select your P-50 printer from the list
4. Create a mzigo in your web app
5. In receipt preview, select "Print via Bridge App"
6. The app should open and print automatically

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| App not opening from web | Check intent filter in AndroidManifest.xml |
| Bluetooth permission denied | Go to Settings → Apps → Mzigo Print Bridge → Permissions |
| Printer not in list | Make sure P-50 is paired in phone Bluetooth settings |
| Print garbled | Check ESC/POS commands match your printer model |
| Connection failed | Ensure printer is on and within range |

---

## Resources

- [Android Bluetooth Guide](https://developer.android.com/guide/topics/connectivity/bluetooth)
- [ESC/POS Command Reference](https://reference.epson-biz.com/modules/ref_escpos/index.php)
- [RawBT Source Code](https://github.com/niclasku/RawBT)
