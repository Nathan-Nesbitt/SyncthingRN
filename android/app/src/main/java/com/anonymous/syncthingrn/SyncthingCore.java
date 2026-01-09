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
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
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
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import android.os.Environment;
import javax.inject.Inject;
import android.content.Context;

public class SyncthingCore {
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

    public static final String NAME = "SyncthingCore";

    private static final String TAG = "SyncthingCore";

    public static String[] createCommandWithBinary(String binary, String[] command) {
        String[] fullCommand = new String[command.length + 1];
        fullCommand[0] = binary;
        System.arraycopy(command, 0, fullCommand, 1, command.length);
        return fullCommand;
    }

    public static ShellCommandResponse runShellCommand(String command) {
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

    private Context context;


    private final String SYNCTHING_BINARY_STRING = "libsyncthing.so";

    public SyncthingCore(Context context) throws ExecutableNotFoundException {
        this.context = context;
        this.validateBinaryExists();
    }

    public String getBinaryLocation() {
        return String.format("%1$s/%2$s", context.getApplicationInfo().nativeLibraryDir, SYNCTHING_BINARY_STRING);
    }

    public void validateBinaryExists() throws ExecutableNotFoundException {
        String binaryLocation = getBinaryLocation();
        File libSyncthing = new File(binaryLocation);
        if (!libSyncthing.exists()) {
            Log.e(TAG, "CRITICAL - Syncthing core binary is missing in APK package location " + binaryLocation);
            throw new ExecutableNotFoundException(binaryLocation);
        } {
            Log.e(TAG, "Binary: " + binaryLocation);
        }
    }

    public String getGatewayIpV4() {
        ConnectivityManager cm = (ConnectivityManager) this.context.getSystemService(Context.CONNECTIVITY_SERVICE);
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

    /**
     * Method to enable multi-cast which is required to find local devices.
     * In general you shouldn't have it enabled, as it consumes more resources.
     * You should close this when done with your operation. 
     */
    public MulticastLock getMulticastLock() {
        WifiManager wifi = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        MulticastLock multicastLock = wifi.createMulticastLock("multicastLock");
        multicastLock.setReferenceCounted(true);
        multicastLock.acquire();
        return multicastLock;
    }

    /**
     * Easy method to call to remove a lock. 
     * @param multicastLock
     */
    public void releaseMulticastLock(MulticastLock multicastLock) {
        if (multicastLock != null) {
            multicastLock.release();
        }
    }

    public RunSyncthingResponse runSyncthingCommand(String[] parameters, HashMap<String, String> environmentVariables) throws IOException, ExecutableNotFoundException {
        Process syncthingProcess = null;
        MulticastLock multicastLock = null;
        int exitCode = 0;
        List<String> logs = new ArrayList<String>();
        
        try {
            // Set up the full command with parameters, and the environment variables
            String[] command = createCommandWithBinary(getBinaryLocation(), parameters);
            Log.e(TAG, Arrays.toString(command));
            
            HashMap<String, String> validatedEnvironmentVariables = validateSyncthingEnvironment(environmentVariables);
            Log.e(TAG, validatedEnvironmentVariables.toString());

            // Creates a process with the environment variables
            ProcessBuilder processBuilder = new ProcessBuilder(command);
            processBuilder.environment().putAll(validateSyncthingEnvironment(environmentVariables));
            syncthingProcess = processBuilder.start();

            // Get all the logs
            logs = getSyncthingLogs(syncthingProcess);
            
            // When the process is done this will run.
            exitCode = syncthingProcess.waitFor();
            
        } catch (IOException | InterruptedException e) {
            logs.add(String.format("Failed to execute syncthing binary or read output: %1$s", e));
        }

        return new RunSyncthingResponse(exitCode, logs);
    }

    /**
     * Look for running libsyncthingnative.so processes and end them gracefully.
     */
    public void killSyncthingInternal() {
        List<String> syncthingPIDs = getSyncthingPIDs();

        Log.e(TAG, syncthingPIDs.toString());

        KillSyncthingResponse response = new KillSyncthingResponse(null);

        if (syncthingPIDs.isEmpty()) { return; }
        
        for (String syncthingPID : syncthingPIDs) {
            response.responses.add(runShellCommand(String.format("kill -SIGINT %1$s \n", syncthingPID)));
        }

        /**
         * Wait for the syncthing instance to end.
         */
        while (!getSyncthingPIDs().isEmpty()) {
            SystemClock.sleep(50);
        }
    }

    public List<String> getSyncthingPIDs() {
        List<String> syncthingPIDs = new ArrayList<String>();
        ShellCommandResponse response = runShellCommand("ps -A\n");
        
        if (response.logs.size() == 0) {
            return syncthingPIDs;
        }

        for (String line : response.logs) {
            Log.e(TAG, line);
            if (line.contains(this.SYNCTHING_BINARY_STRING)) {
                syncthingPIDs.add(line.trim().split("\\s+")[1]);
            }
        }

        return syncthingPIDs;
    }

    private List<String> getSyncthingLogs(Process process) throws IOException {
        BufferedReader outputReader = null;
        List<String> syncthingLogs = new ArrayList<>();
        try {
            outputReader = new BufferedReader(new InputStreamReader(process.getInputStream(), "UTF_8"));
            
            String line;
            while ((line = outputReader.readLine()) != null) {
                Log.i(TAG, line);
                syncthingLogs.add(line);
            }

        } catch (IOException e) {
            Log.w(TAG, "Error getting syncthing logs", e);
        } finally {
            if (outputReader != null) outputReader.close();
        }

        return syncthingLogs;
    }

    private String getSyncthingHomeDirectoryAbsolutePath() {
        return Environment.getExternalStorageDirectory().getAbsolutePath() + "/syncthing";
    }

    private HashMap<String, String> validateSyncthingEnvironment(HashMap<String, String> environment) {
        
        if (!environment.containsKey("HOME") || environment.get("HOME") == "") {
            environment.put("HOME", getSyncthingHomeDirectoryAbsolutePath());
        }

        if (!environment.containsKey("STHOMEDIR") || environment.get("HOME") == "") {
            environment.put("STHOMEDIR", this.context.getFilesDir().toString());
        }

        if (!environment.containsKey("STVERSIONEXTRA") || environment.get("STVERSIONEXTRA") == "") {
            environment.put("STVERSIONEXTRA", context.getPackageName());
        }

        if (!environment.containsKey("SQLITE_TMPDIR") || environment.get("SQLITE_TMPDIR") == "") {
            environment.put("SQLITE_TMPDIR", context.getCacheDir().getAbsolutePath());
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
