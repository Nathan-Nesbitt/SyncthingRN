import { NativeModules } from "react-native";
const { AppPaths } = NativeModules;

export const REACT_NATIVE_LIBRARY_DIRECTORY = await AppPaths.getNativeLibraryDir();
