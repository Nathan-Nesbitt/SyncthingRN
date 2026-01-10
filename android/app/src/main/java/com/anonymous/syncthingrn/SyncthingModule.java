package com.anonymous.syncthingrn;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
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

import java.io.IOException;
import java.util.HashMap;

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
        Log.e(TAG, "Spawning Syncthing Worker");
        SyncthingWorker.startWorker(this.reactContext, readableMapToHashMap(environmentVariables));
        promise.resolve("");
    }

    @ReactMethod
    public void getAPIKey(Promise promise) throws IOException, SyncthingCore.ExecutableNotFoundException {
        String[] parameters = {"cli", "config", "gui", "apikey", "get"};
        String result = this.syncthingCore.runSyncthingCommand(parameters, this.syncthingCore.validateSyncthingEnvironment(new HashMap<>())).toString();
        promise.resolve(result);
    }
}
