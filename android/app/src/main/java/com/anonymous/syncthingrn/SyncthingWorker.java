package com.anonymous.syncthingrn;

import static androidx.core.app.NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE;

import java.util.HashMap;
import java.io.IOException;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import androidx.work.Constraints;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.ExistingWorkPolicy;
import androidx.work.Operation;
import androidx.work.Worker;
import androidx.work.WorkManager;
import androidx.work.ForegroundInfo;
import androidx.annotation.NonNull;
import androidx.work.WorkerParameters;

import com.anonymous.SyncthingRN.R;
import com.facebook.react.bridge.ReactApplicationContext;

public class SyncthingWorker extends Worker {

    private static final String TAG = "SyncthingWorker";
    private static final int notificationId = 1;

    /**
     * Method to trigger the creation of the worker in the background. Should be started on first run. 
     * @param environmentVariables
     */
    public static void startWorker(ReactApplicationContext context, HashMap environmentVariables) {

        // Constraints constraints = new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build();

        OneTimeWorkRequest syncthingWorkerRequest = new OneTimeWorkRequest.Builder(SyncthingWorker.class).build();

        Operation manager = WorkManager.getInstance(context).enqueueUniqueWork(
            TAG,
            ExistingWorkPolicy.REPLACE,
            syncthingWorkerRequest
        );
    }

    private Context context;

    public SyncthingWorker(
       @NonNull Context context,
       @NonNull WorkerParameters params) {
       super(context, params);
       this.context = context;
    }

    @NonNull
    @Override
    public Result doWork() {
        // Since we are always running this via a worker, and the worker should always
        // be running we can assume that the server isn't running.
        
        // Create SyncthingCore instance to get the binary location
        try {
            SyncthingCore syncthingCore = new SyncthingCore(context);
        
            // Create command to start syncthing with minimal arguments
            String[] parameters = {"--no-browser"};
            
            // Create environment variables
            HashMap<String, String> environmentVariables = new HashMap<>();
            
            // Create an overlay so the task doesn't die
            setForegroundAsync(getForegroundInfo());

            // Create the syncthing instance using the SyncthingCore's method
            int exitCode = syncthingCore.runSyncthing(parameters, environmentVariables);
                
            // Log.d(TAG, "Syncthing process started with exit code: " + exitCode);

            return Result.success();
        } catch (SyncthingCore.ExecutableNotFoundException e) {
            return Result.failure();
        } catch (IOException e) {
            return Result.retry();
        }
    }

    @NonNull
    @Override
    public ForegroundInfo getForegroundInfo() {
        Context context = getApplicationContext();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createChannel();
        }

        Notification notification = new NotificationCompat.Builder(context, TAG)
                .setContentTitle("Running Syncthing")
                .setContentText("Running in foreground")
                .setSmallIcon(R.drawable.splashscreen_logo)
                .setForegroundServiceBehavior(FOREGROUND_SERVICE_IMMEDIATE)
                .setOngoing(true)
                .build();

        return new ForegroundInfo(notificationId, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC);
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private void createChannel() {
        NotificationChannel channel = new NotificationChannel(TAG, TAG, NotificationManager.IMPORTANCE_DEFAULT);
        channel.setDescription(TAG);
        // Register the channel with the system
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.createNotificationChannel(channel);
    }
}
