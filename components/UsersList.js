import { useCallback, useEffect, useState } from "react"

import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native"

import { useFirebaseAuth, useFirebase } from "../hooks"

import { collection, getDocs, addDoc } from "firebase/firestore"

import { ref, getDownloadURL } from "firebase/storage"

import { LinearGradient } from "expo-linear-gradient"

export function UsersList() {
  const [users, setUsers] = useState([])
  const [createUserInput, setCreateUserInput] = useState("")

  const [loginUserInput, setLoginUserInput] = useState({
    email: "",
    password: "",
  })
  const [loggedUser, setLoggedUser] = useState(null)

  const { handleEmailLogin } = useFirebaseAuth()

  const [option, setOption] = useState("create")

  const [isLoadingUsers, setIsLoadingUsers] = useState(true)

  const { db, storage } = useFirebase()

  const usersRef = collection(db, "users")

  const fetchUsers = useCallback(async () => {
    const usersQuery = await getDocs(usersRef)

    usersQuery.forEach(async (item) => {
      const userData = item.data()

      const coverImageRef = ref(storage, userData?.avatarUrl)
      const coverImageUrl = await getDownloadURL(coverImageRef)

      setUsers([...users, { ...userData, coverImage: coverImageUrl }])
    })

    setIsLoadingUsers(false)
  }, [users])

  async function handleCreateUserOnFirebase({ user }) {
    if (!user) return

    const userRef = await addDoc(collection(db, "users"), {
      username: user,
    })

    alert(`Created user with ID: ${userRef.id}`)

    return
  }

  function handleOptions({ option }) {
    setOption(option)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  function renderUserCard({ item, index }) {
    const borderRadius = 8

    return (
      <View style={{ height: 150, marginBottom: 16, borderRadius }}>
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)"]}
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: 9999,
          }}
        />

        <Image
          borderRadius={borderRadius}
          source={{ uri: item?.coverImage }}
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "white",
          }}
        />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-end",
            marginVertical: 16,
          }}
        >
          <Text style={{ color: "white", fontSize: 24, fontWeight: "700" }}>
            {item?.username}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        {isLoadingUsers && (
          <ActivityIndicator color="white" style={{ height: 150 }} />
        )}

        {!isLoadingUsers && (
          <>
            <FlatList
              showsVerticalScrollIndicator={false}
              bounces={false}
              renderItem={renderUserCard}
              data={users}
              style={{ flex: 1 }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginVertical: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => handleOptions({ option: "create" })}
                style={{
                  marginRight: 16,
                  backgroundColor: "white",
                  minWidth: 64 * 2,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 9999,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  Create user
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleOptions({ option: "login" })}
                style={{
                  marginRight: 16,
                  backgroundColor: "white",
                  minWidth: 64 * 2,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 9999,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                }}
              >
                <Text
                  style={{
                    color: "black",
                    fontSize: 18,
                    fontWeight: "600",
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              style={{ flex: 1 }}
            >
              {option === "create" && (
                <View style={{ flex: 1, marginTop: 32 }}>
                  <View style={{ marginBottom: 16, alignSelf: "center" }}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "600",
                      }}
                    >
                      Create user on firebase
                    </Text>
                  </View>

                  <TextInput
                    value={createUserInput}
                    placeholder="New user name"
                    placeholderTextColor="rgba(0,0,0,0.6)"
                    onChangeText={setCreateUserInput}
                    style={{
                      minHeight: 64,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      backgroundColor: "white",
                      color: "black",
                      marginBottom: 16,
                      marginHorizontal: 16,
                      borderRadius: 8,
                    }}
                  />

                  <TouchableOpacity
                    activeOpacity={0.75}
                    style={{
                      backgroundColor: "white",
                      minHeight: 64,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 8,
                    }}
                    onPress={() =>
                      handleCreateUserOnFirebase({ user: createUserInput })
                    }
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: 18,
                        fontWeight: "500",
                      }}
                    >
                      Submit user
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {option === "login" && (
                <View style={{ flex: 1, marginTop: 32 }}>
                  <TextInput
                    value={loginUserInput.email}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(0,0,0,0.6)"
                    onChangeText={(text) =>
                      setLoginUserInput((state) => ({ ...state, email: text }))
                    }
                    style={{
                      minHeight: 64,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      backgroundColor: "white",
                      color: "black",
                      marginBottom: 16,
                      marginHorizontal: 16,
                      borderRadius: 8,
                    }}
                  />

                  <TextInput
                    value={loginUserInput.password}
                    secureTextEntry
                    placeholder="Your password here please"
                    placeholderTextColor="rgba(0,0,0,0.6)"
                    onChangeText={(text) =>
                      setLoginUserInput((state) => ({
                        ...state,
                        password: text,
                      }))
                    }
                    style={{
                      minHeight: 64,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      backgroundColor: "white",
                      color: "black",
                      marginBottom: 16,
                      marginHorizontal: 16,
                      borderRadius: 8,
                    }}
                  />

                  <Button
                    title="Login"
                    color="white"
                    onPress={async () => {
                      const user = await handleEmailLogin({
                        email: loginUserInput.email.trim(),
                        password: loginUserInput.password.trim(),
                      })

                      setLoginUserInput({ email: "", password: "" })
                      setLoggedUser(user)
                      alert(`${user.email} logged`)

                      setOption("user")
                    }}
                  />
                </View>
              )}

              {option === "user" && (
                <View style={{ flex: 1, marginTop: 32 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "600",
                        marginRight: 8,
                      }}
                    >
                      ID: {loggedUser.uid}
                    </Text>

                    <Text
                      style={{
                        color: "white",
                        fontSize: 18,
                        fontWeight: "600",
                      }}
                    >
                      EMAIL: {loggedUser.email}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      height: 2,
                      backgroundColor: "white",
                      marginVertical: 16,
                    }}
                  />

                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontWeight: "600",
                      alignSelf: "center",
                      marginBottom: 16,
                    }}
                  >
                    Complete data
                  </Text>

                  <Text
                    style={{
                      color: "white",
                      opacity: 0.65,
                      fontSize: 18,
                      fontWeight: "600",
                    }}
                  >
                    {JSON.stringify(loggedUser)}
                  </Text>
                </View>
              )}
            </ScrollView>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}
