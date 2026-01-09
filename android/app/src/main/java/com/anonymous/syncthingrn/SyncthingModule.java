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
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
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
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import android.os.Environment;

/*
    This class manages the connection between react native and native code.
*/
@ReactModule(name = SyncthingModule.NAME)
public class SyncthingModule extends ReactContextBaseJavaModule {

    public static final String NAME = "SyncthingModule";
    private static final String TAG = "SyncthingModule";
    
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

    private SyncthingCore syncthingCore;
    private ReactApplicationContext reactContext;

    public SyncthingModule(ReactApplicationContext reactContext) throws SyncthingCore.ExecutableNotFoundException {
        super(reactContext);
        this.reactContext = reactContext;
        this.syncthingCore = new SyncthingCore(reactContext.getApplicationContext());
        this.syncthingCore.validateBinaryExists();
    }

    @ReactMethod
    public void runShellCommand(String command, Promise promise) {
        try {
            SyncthingCore.ShellCommandResponse response = this.syncthingCore.runShellCommand(command);
            // Convert response to JS object
            WritableMap resultMap = new WritableNativeMap();
            
            resultMap.putInt("exitCode", response.exitCode());
            
            WritableArray logsArray = new WritableNativeArray();
            for (String log : response.logs()) {
                logsArray.pushString(log);
            }
            
            resultMap.putArray("logs", logsArray);
            // Add the command that was executed
            resultMap.putString("command", command);
            
            promise.resolve(resultMap);
        } catch (Exception e) {
            promise.reject("RUN_SHELL_COMMAND_ERROR", e.getMessage());
        }
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void spawnSyncthingWorker(ReadableMap environmentVariables, Promise promise) throws IOException, SyncthingCore.ExecutableNotFoundException {
        SyncthingWorker.startWorker(this.reactContext, readableMapToHashMap(environmentVariables));
        promise.resolve("");
    }

    @ReactMethod
    public void stopSyncthingWorker(Promise promise) {
        SyncthingWorker.stopWorker(this.reactContext);
        promise.resolve("");
    }

    @ReactMethod
    public void runSyncthingCommand(ReadableArray params, ReadableMap environmentVariables, Promise promise) throws IOException, SyncthingCore.ExecutableNotFoundException {
        try {
            SyncthingCore.RunSyncthingResponse response = this.syncthingCore.runSyncthingCommand(readableArrayToStringArray(params), readableMapToHashMap(environmentVariables));
            // Convert response to JS object
            WritableMap resultMap = new WritableNativeMap();
            resultMap.putInt("exitCode", response.exitCode());
            WritableArray logsArray = new WritableNativeArray();
            for (String log : response.logs()) {
                logsArray.pushString(log);
            }
            resultMap.putArray("logs", logsArray);
            // Add the command that was executed
            WritableArray commandArray = new WritableNativeArray();
            for (int i = 0; i < params.size(); i++) {
                commandArray.pushString(params.getString(i));
            }
            resultMap.putArray("command", commandArray);
            promise.resolve(resultMap);
        } catch (Exception e) {
            promise.reject("CREATE_SYNCTHING_INSTANCE_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void killSyncthing(Promise promise) {
        try {
            
        } catch (Exception e) {
            promise.reject("KILL_SYNCTHING_ERROR", e.getMessage());
        }
    }
}
