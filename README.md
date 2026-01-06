# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

```bash
npm install
```

2. Ensure that the submodules have been pulled (Pulls syncthing from remote)

```bash
git submodule update --init --recursive
```

3. Ensure that you have android studio set up, you have installed the SDK and SDK Command Line Tools (the cli tools have to be manually installed via the GUI), and that you have set the environment variables in your environment. E.g. in `~/.bashrc` you can set:

```sh
export ANDROID_HOME=~/Android/Sdk
export ANDROID_NDK_ROOT=$ANDROID_HOME/ndk
```

Then run the following to refresh the terminal with the variables:

```sh
. ~/.bashrc
```

3. PreBuild the application to create the android folder.

```bash
npx expo prebuild
```


4. Run expo in one terminal

```bash
npx expo start
```

5. Build and run the application in a second window:

```bash
npx react-native run-android
```

5. 

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

### Potential Issues

If you run into weird issues, sometimes you need to restart to get the build to fix JDK issues.

## Building the Syncthing API for android

1. Run `git submodule update --init` to get the syncthing submodule.
2. Run `cd syncthing && python3 ./build-syncthing.py` to build syncthing for android.