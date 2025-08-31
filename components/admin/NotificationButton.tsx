"use client";
import { selectSubscribed } from "@/lib/redux/authSlice";
import OneSignal from 'react-onesignal'
import { useDispatch, useSelector } from "react-redux";
import { subscribedTrue, subscribedFalse } from "@/lib/redux/authSlice"
import { toast } from "sonner";
import { useState } from "react";
import { X, Bell } from "lucide-react";

interface property {
    prop: boolean
}

export default function NotificationButton({ prop }: property) {
    const subscribed = useSelector(selectSubscribed)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true)
        try {
            if (subscribed) {
                // Abonelikten çık
                OneSignal.User.PushSubscription.optOut();
                toast.warning("Abonelikten çıkıldı ❌")
                dispatch(subscribedFalse())
            } else {
                // Tarayıcıdan izin iste
                await OneSignal.Notifications.requestPermission()
                if (!subscribed) {
                    await OneSignal.User.PushSubscription.optIn();
                    toast.success("Abone olundu ✅")
                    dispatch(subscribedTrue())
                }
            }
        } catch (err) {
            console.error("İşlem hatası:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <button disabled>Yükleniyor...</button>;
    }

    return (
        <button
            onClick={handleClick}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-500  hover:bg-gray-700 hover:text-red-600 transition-colors"
        >
            {subscribed ? <X className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            {(() => { // Hemen çağrılan fonksiyon ifadesi (IIFE)
                if (!prop) {
                    if (subscribed) {
                        return <p>Abonelikten Çık</p>
                    } else {
                        return <p>Abone Ol</p>
                    }

                } else {
                    return null
                }
            })()}
        </button>
    );
}