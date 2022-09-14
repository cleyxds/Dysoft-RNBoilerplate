import { View } from "react-native"
import { UsersList } from "./components/UsersList"

import { useFirebase } from "./hooks/useFirebase"

export default function App() {
  useFirebase()

  return (
    <View style={{ paddingVertical: 20, flex: 1, backgroundColor: "#000" }}>
      <UsersList />
    </View>
  )
}
