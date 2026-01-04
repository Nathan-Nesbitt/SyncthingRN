import { SyncthingProvider } from "@/utils/syncthing/SyncthingContext";
import Homepage from "./homepage";

const App = () => {
  return (
    <SyncthingProvider binaryPath="/usr/bin/syncthing">
      <Homepage />
    </SyncthingProvider>
  )
};

export default App;
