import { useCallback, useEffect, useState } from "react"

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native"

import { useFirebase } from "../hooks/useFirebase"

import { collection, getDocs } from "firebase/firestore"

import { ref, getDownloadURL } from "firebase/storage"

import { LinearGradient } from "expo-linear-gradient"

export function UsersList() {
  const [users, setUsers] = useState([])
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
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [])

  function renderUserCard({ item, index }) {
    const borderRadius = 8

    return (
      <View style={{ height: 150, marginBottom: 16, borderRadius }}>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: 9999,
          }}
        />

        <Image
          source={{ uri: item?.coverImage }}
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: "white",
            borderRadius,
          }}
        />

        <View
          style={{
            alignItems: "center",
            marginVertical: 16,
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
            {item?.username}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <>
      {isLoadingUsers && (
        <ActivityIndicator color="white" style={{ height: 150 }} />
      )}
      {!isLoadingUsers && (
        <FlatList
          showsVerticalScrollIndicator={false}
          renderItem={renderUserCard}
          data={users}
        />
      )}
    </>
  )
}
