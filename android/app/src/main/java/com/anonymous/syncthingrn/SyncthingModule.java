package com.anonymous.syncthingrn;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.LinkProperties;
import android.net.Network;
import android.net.RouteInfo;
import android.net.wifi.WifiManager;
import android.net.wifi.WifiManager.MulticastLock;
import android.os.Build;
import android.os.Environment;
import android.os.SystemClock;
import android.text.TextUtils;
import android.util.Log;

import android.net.ConnectivityManager;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.OutputStreamWriter;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.security.InvalidParameterException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import android.os.Environment;
import javax.inject.Inject;
import android.content.Context;

@ReactModule(name = SyncthingModule.NAME)
public class SyncthingModule extends ReactContextBaseJavaModule {
    public static class ExecutableNotFoundException extends Exception {

        public ExecutableNotFoundException(String message) {
            super(message);
        }

        public ExecutableNotFoundException(String message, Throwable throwable) {
            super(message, throwable);
        }

    }

    public record ShellCommandResponse(int exitCode, List<String> logs) {}

    public record KillSyncthingResponse(List<ShellCommandResponse> responses) {}

    public record RunSyncthingResponse(int exitCode, List<String> logs) {}

    public static final String NAME = "SyncthingModule";

    private static final String TAG = "SyncthingModule";

    private static final AtomicReference<Process> syncthingProcess = new AtomicReference<>();

    public static String[] createCommandWithBinary(String binary, String[] command) {
        String[] fullCommand = new String[command.length + 1];
        fullCommand[0] = binary;
        System.arraycopy(command, 0, fullCommand, 1, command.length);
        return fullCommand;
    }

    @ReactMethod
    public static void runShellCommand(String command) {
        runShellCommandInternal(command);
    }

    public static String[] readableArrayToStringArray(ReadableArray readableArray) {
        String[] stringArray = new String[readableArray.size()];
        for (int i = 0; i < readableArray.size(); i++) {
            stringArray[i] = readableArray.getString(i);
        }
        return stringArray;
    }

    public static HashMap<String, String> readableMapToHashMap(ReadableMap readableMap) {
        HashMap<String, String> hashMap = new HashMap<>();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            hashMap.put(key, readableMap.getString(key));
        }
        return hashMap;
    }


    private static ShellCommandResponse runShellCommandInternal(String command) {
        int exitCode = 255;
        Process shellProcess = null;
        DataOutputStream shellOutput = null;
        List<String> logs = new ArrayList<String>(); 

        try {
            shellProcess = Runtime.getRuntime().exec(new String[]{"sh"});
            shellOutput = new DataOutputStream(shellProcess.getOutputStream());

            BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(shellOutput));

            bufferedWriter.write(command);
            bufferedWriter.flush();
            shellOutput.close();
            shellOutput = null;

            BufferedReader bufferedReader = null;

            try {
                bufferedReader = new BufferedReader(new InputStreamReader(shellProcess.getInputStream(), "UTF-8"));
                logs = bufferedReader.lines().toList();
                
            } catch (IOException e) {
                logs.add("runShellCommand: Failed to read output");
            } finally {
                if (bufferedReader != null) {
                    bufferedReader.close();
                }
            }
            exitCode = shellProcess.waitFor();
        } catch (IOException | InterruptedException e) {
            logs.add(String.format("Error running shell command: %1$s", e));
        } finally {
            try {
                if (shellOutput != null) {
                    shellOutput.close();
                }
            } catch (IOException e) {
                logs.add("Failed to close stream");
            }
            if (shellProcess != null) {
                shellProcess.destroy();
            }
        }

        return new ShellCommandResponse(exitCode, logs);
    }

    private ReactApplicationContext reactContext;

    private final String SYNCTHING_BINARY_STRING = "libsyncthing.so";

    public SyncthingModule(ReactApplicationContext reactContext) throws ExecutableNotFoundException {
        super(reactContext);
        this.reactContext = reactContext;
        this.validateBinaryExists();
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void createSyncthingInstance(ReadableArray command, ReadableMap environmentVariables) throws IOException, ExecutableNotFoundException {
        createSyncthingInstanceInternal(readableArrayToStringArray(command), readableMapToHashMap(environmentVariables));
    }


    public String getBinaryLocation() {
        return String.format("%1$s/%2$s", reactContext.getApplicationInfo().nativeLibraryDir, SYNCTHING_BINARY_STRING);
    }


    @ReactMethod
    public void killSyncthing() {
        killSyncthingInternal();
    }

    private String getGatewayIpV4() {
        ConnectivityManager cm = (ConnectivityManager) this.reactContext.getSystemService(Context.CONNECTIVITY_SERVICE);
        Network activeNetwork = cm.getActiveNetwork();
        if (activeNetwork == null) return null;

        LinkProperties props = cm.getLinkProperties(activeNetwork);
        if (props == null) return null;

        for (RouteInfo route : props.getRoutes()) {
            InetAddress gateway = route.getGateway();
            if (route.isDefaultRoute() && gateway instanceof Inet4Address) {
                return gateway.getHostAddress();
            }
        }
        return null;
    }

    private void validateBinaryExists() throws ExecutableNotFoundException {
        String binaryLocation = getBinaryLocation();
        File libSyncthing = new File(binaryLocation);
        if (!libSyncthing.exists()) {
            Log.e(TAG, "CRITICAL - Syncthing core binary is missing in APK package location " + binaryLocation);
            throw new ExecutableNotFoundException(binaryLocation);
        } {
            Log.e(TAG, "Binary exists in" + binaryLocation);
        }
    }

    private MulticastLock getMulticastLock() {
        WifiManager wifi = (WifiManager) reactContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        MulticastLock multicastLock = wifi.createMulticastLock("multicastLock");
        multicastLock.setReferenceCounted(true);
        multicastLock.acquire();
        return multicastLock;
    }

    private RunSyncthingResponse createSyncthingInstanceInternal(String[] command, HashMap<String, String> environmentVariables) throws IOException, ExecutableNotFoundException {
        Process newSyncthingProcess = null;
        MulticastLock multicastLock = null;
        int exitCode = 0;
        List<String> logs = new ArrayList<String>();
        
        try {
            multicastLock = this.getMulticastLock();

            // Creates a process with the environment variables            
            ProcessBuilder processBuilder = new ProcessBuilder(createCommandWithBinary(getBinaryLocation(), command));
            processBuilder.environment().putAll(validateSyncthingEnvironment(environmentVariables));
            newSyncthingProcess = processBuilder.start();
            // Creates the process
            syncthingProcess.set(newSyncthingProcess);
            
            // When the process is done this will run.
            exitCode = newSyncthingProcess.waitFor();
            syncthingProcess.set(null);
            
        } catch (IOException | InterruptedException e) {
            logs.add(String.format("Failed to execute syncthing binary or read output: %1$s", e));
        } finally {
            if (multicastLock != null) {
                multicastLock.release();
                multicastLock = null;
            }
            if (newSyncthingProcess != null) {
                newSyncthingProcess.destroy();
            }
        }

        return new RunSyncthingResponse(exitCode, logs);
    }

    /**
     * Look for running libsyncthingnative.so processes and end them gracefully.
     */
    private void killSyncthingInternal() {
        List<String> syncthingPIDs = getSyncthingPIDs();

        KillSyncthingResponse response = new KillSyncthingResponse(null);

        if (syncthingPIDs.isEmpty()) { return; }
        
        for (String syncthingPID : syncthingPIDs) {
            response.responses.add(runShellCommandInternal(String.format("kill -SIGINT %1$s \n", syncthingPID)));
        }

        /**
         * Wait for the syncthing instance to end.
         */
        while (!getSyncthingPIDs().isEmpty()) {
            SystemClock.sleep(50);
        }
    }

    private List<String> getSyncthingPIDs() {
        List<String> syncthingPIDs = new ArrayList<String>();
        ShellCommandResponse response = runShellCommandInternal("ps\n");
        
        if (response.logs.size() == 0) {
            return syncthingPIDs;
        }

        for (String line : response.logs) {
            if (line.contains(this.SYNCTHING_BINARY_STRING)) {
                syncthingPIDs.add(line.trim().split("\\s+")[1]);
            }
        }

        return syncthingPIDs;
    }

    private String getSyncthingHomeDirectoryAbsolutePath() {
        return Environment.getExternalStorageDirectory().getAbsolutePath() + "/syncthing";
    }

    private HashMap<String, String> validateSyncthingEnvironment(HashMap<String, String> environment) {
        
        if (!environment.containsKey("HOME") || environment.get("HOME") == "") {
            environment.put("HOME", getSyncthingHomeDirectoryAbsolutePath());
        }

        if (!environment.containsKey("STHOMEDIR") || environment.get("HOME") == "") {
            environment.put("STHOMEDIR", this.reactContext.getFilesDir().toString());
        }

        if (!environment.containsKey("STVERSIONEXTRA") || environment.get("STVERSIONEXTRA") == "") {
            environment.put("STVERSIONEXTRA", reactContext.getPackageName());
        }

        if (!environment.containsKey("SQLITE_TMPDIR") || environment.get("SQLITE_TMPDIR") == "") {
            environment.put("SQLITE_TMPDIR", reactContext.getCacheDir().getAbsolutePath());
        }

        final String gatewayIpV4 = this.getGatewayIpV4();
        if (gatewayIpV4 != null) {
            environment.put("FALLBACK_NET_GATEWAY_IPV4", gatewayIpV4);
        }

        // Memory usage optimization
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            environment.put("GOGC", "75"); 
        }

        return environment;
    }
}
