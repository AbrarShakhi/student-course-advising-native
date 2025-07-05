import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const checkLogin = async () => {
            const studentId = await AsyncStorage.getItem("student_id");
            if (studentId) {
                router.replace("/(main)/home");
            } else {
                router.replace("/(auth)/login");
            }
        };
        checkLogin();
    }, [router]);

    return null;
}
