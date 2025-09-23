'use client'
import React, { use, useEffect, useState } from 'react'
import './PropertyListingFlyer.css'
import PropertyGetData from '@/dto/getproperty.dto'
import api from '@/lib/axios'
import { toast } from 'sonner'

interface EditPropertyPageProps {
    params: Promise<{ id: string }>
}

const PropertyListingFlyer = ({ params }: EditPropertyPageProps) => {
    const { id } = use(params)
    const [properties, setProperties] = useState<PropertyGetData | null>(null)
    useEffect(() => {
        if (id) {
            const getPropertyById = async (id: string) => {
                try {
                    const res = await api.get(`/properties/${id}`)
                    const propertydata = res.data
                    propertydata.selectedFeatures = Object.values(propertydata.selectedFeatures).flat()
                    setProperties(propertydata)
                } catch (error) {
                    toast.error("İlan verileri yüklenirken bir hata oluştu.")
                }
            }
            getPropertyById(id)
        }

    }, [id])

    if (!properties) {
        return <div>Loading...</div>
    }

    return (
        <div id="app" className="w-full h-full flex items-center justify-center">
            <div className="page bg-white">


                <div className="flex items-center bg-gray-200 rounded-lg justify-between mb-3">
                    <div className="flex items-center p-3 gap-3">

                        <div className="flex gap-2 items-center">
                            <div className="w-40 h-24 rounded-lg overflow-hidden border border-gray-300">

                                <img src={properties.images[3]} alt="thumb1" className="object-cover w-full h-full" />
                            </div>
                            <div className="w-40 h-24 rounded-lg overflow-hidden border border-gray-300">
                                <img src={properties.images[4]} alt="thumb2" className="object-cover w-full h-full" />
                            </div>
                            <div className="w-40 h-24 rounded-lg overflow-hidden border border-gray-300">
                                <img src={properties.images[5]} alt="thumb3" className="object-cover w-full h-full" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center p-3 gap-6">
                        <div className="text-4xl font-greatevibes font-normal not-italic leading-none">Derya Emlak Who Estate</div>

                    </div>

                    <div className="flex items-center p-3 gap-2">
                        <div className="w-30 h-20 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm">
                            <img src="/turkey.jpg" alt="thumb3" className="object-fill rounded-lg w-full h-full" />
                        </div>
                        <div className="w-30 h-20 rounded-lg border border-gray-200 flex items-center justify-center text-xs">
                            <img src="/favicon.png" alt="thumb3" className="object-fill rounded-lg w-full h-full" />
                        </div>
                    </div>
                </div>


                <div className="flex flex-1 h-[400px] gap-4">

                    <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="rounded-lg overflow-hidden h-full">
                            <img src={properties.images[0]} alt="villa" className="object-cover w-full h-full" style={{ minHeight: "260px" }} />
                        </div>
                    </div>


                    <div className="w-72 flex flex-col gap-4">
                        <div className="rounded-lg p-2 bg-white border border-gray-200">
                            <img src={properties.images[1]} alt="interior" className="object-fill w-full h-36 rounded-md" />
                        </div>
                        <div className="rounded-lg p-2 bg-white border border-gray-200 flex-1">
                            <img src={properties.images[2]} alt="pool" className="object-fill w-full h-109 rounded-md" />
                        </div>
                    </div>


                    <div className="w-80 rounded-lg p-6" style={{ background: "#ffef6a" }}>
                        <div className="text-xl font-semibold mb-2">{properties.title}</div>

                        <ul className="list-disc pl-5 leading-relaxed space-y-2 text-gray-800">
                            <li contentEditable={true} suppressContentEditableWarning={true}>ÇİLEKLİ VİLLALARI</li>
                            <li contentEditable={true} suppressContentEditableWarning={true}>ŞÖMİNE + 3 BALKON</li>
                            <li className="font-bold"><span contentEditable={true} suppressContentEditableWarning={true}>4 + 2</span> &nbsp; <span contentEditable={true} suppressContentEditableWarning={true}>310</span> m<sup>2</sup></li>
                            <li contentEditable={true} suppressContentEditableWarning={true}>YARI OLİMPİK HAVUZ</li>
                            <li contentEditable={true} suppressContentEditableWarning={true}>21000 m2 ARSA İÇİNDE</li>
                            <li contentEditable={true} suppressContentEditableWarning={true}>KAT MÜLKİYETLİ</li>
                        </ul>
                    </div>
                </div>


                <div className="mt-4">
                    <div className="w-full bg-red-600 rounded-md p-4 flex items-center justify-center">
                        <div className="text-6xl text-white font-extrabold tracking-tight"><span contentEditable={true} suppressContentEditableWarning={true}>{properties.listingType === "Satılık" ? "SATILIK" : "KİRALIK"}</span> <span className="ml-6">{Number(properties.price).toLocaleString('tr-TR')}</span></div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PropertyListingFlyer