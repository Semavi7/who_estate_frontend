'use client'
import React, { useEffect } from 'react'
import OneSignal from 'react-onesignal';
import { useDispatch } from 'react-redux';
import { subscribedFalse, subscribedTrue } from "@/lib/redux/authSlice"

const OneSignalInitializer = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const signalInitializer = async () => {
            // Ensure this code runs only on the client side

            if (typeof window !== "undefined") {
                const oneSignalKey: string | undefined = "9444ff94-05a3-4178-880e-870a4ed703bf"
                await OneSignal.init({
                    appId: oneSignalKey
                });
                const res = await OneSignal.User.PushSubscription.optedIn
                console.log('res', res)
                if (res) {
                    dispatch(subscribedTrue())
                }
                else {
                    dispatch(subscribedFalse())
                }
            }
        }
        signalInitializer()
    }, [])
    return null
}

export default OneSignalInitializer