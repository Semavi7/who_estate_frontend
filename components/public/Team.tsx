'use client'
import { IUser } from '@/app/(admin)/admin/users/page'
import api from '@/lib/axios'
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from '../ui/avatar'

const Team = () => {
    const [users, setUsers] = useState<IUser[]>([])

    const getUser = async () => {
        try {
            const res = await api.get('/user')
            setUsers(res.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <>
            {users.map((member, index) => (
                <Card key={index} className="text-center overflow-hidden">
                    <div className="relative">
                        
                        <Avatar >
                            <AvatarImage className="w-64 h-64 object-cover" src={member.image} />
                            <AvatarFallback className="text-9xl w-64 h-64">
                                {member.name.charAt(0).toUpperCase()}
                                {member.surname.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        
                    </div>
                    <CardContent className="p-6">
                        <h3 className="text-lg mb-2">{member.name} {member.surname}</h3>
                        <p className="text-gray-600">{member.roles === 'admin' ? 'Yönetici' : (member.name === 'Mehmet Burçhan' ? 'Yazılım Uzmanı' : 'Emlak Danışmanı')}</p>
                    </CardContent>
                </Card>
            ))}
        </>
    )
}

export default Team