package com.anonymous.syncthingrn;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;

import java.sql.ResultSet;
import java.util.HashMap;
import java.io.IOException;

import javax.annotation.Nullable;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.util.Log;

import javax.inject.Inject;
import javax.xml.transform.Result;

import android.content.Context;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkRequest;
import androidx.work.ExistingWorkPolicy;
import androidx.work.Worker;
import androidx.work.WorkManager;
import androidx.work.ForegroundInfo;
import androidx.annotation.NonNull;
import androidx.work.WorkerParameters;
import com.facebook.react.bridge.ReactApplicationContext; 


public class SyncthingWorker extends Worker {

    private static final String TAG = "SyncthingWorker";
    private static final int notificationId = 1;

    /**
     * Method to trigger the creation of the worker in the background. Should be started on first run. 
     * @param environmentVariables
     * @param promise
     */
    public static void startWorker(ReactApplicationContext context, HashMap environmentVariables) {
        OneTimeWorkRequest syncthingWorkerRequest = new OneTimeWorkRequest.Builder(SyncthingWorker.class).build();

        WorkManager.getInstance(context).enqueueUniqueWork(
            TAG,
            ExistingWorkPolicy.KEEP,
            syncthingWorkerRequest
        );
    }
    public static void stopWorker(ReactApplicationContext context) {
        WorkManager workManager = WorkManager.getInstance(context);
        workManager.getInstance(context).cancelAllWorkByTag(TAG);
    }

    private NotificationManager notificationManager;


    private Context context;

    public SyncthingWorker(
       @NonNull Context context,
       @NonNull WorkerParameters params) {
       super(context, params);
       this.context = context;
    }

    @Override
    public Result doWork() {
        // Since we are always running this via a worker, and the worker should always
        // be running we can assume that the server isn't running.
        
        // Create SyncthingCore instance to get the binary location
        try {
            SyncthingCore syncthingCore = new SyncthingCore(context);
        
            // Create command to start syncthing with minimal arguments
            String[] parameters = {"--no-browser", "--gui-apikey=foobar"};
            
            // Create environment variables
            HashMap<String, String> environmentVariables = new HashMap<>();
            
            // Create an overlay so the task doesn't die
            // setForegroundAsync(createForegroundInfo("Syncthing Running"));

            // Create the syncthing instance using the SyncthingCore's method
            SyncthingCore.RunSyncthingResponse response = syncthingCore.runSyncthingCommand(parameters, environmentVariables);
                
            Log.d(TAG, "Syncthing process started with exit code: " + response.exitCode());

            return Result.success();
        } catch (SyncthingCore.ExecutableNotFoundException e) {
            return Result.failure();
        } catch (IOException e) {
            return Result.retry();
        }
    }
}
