export default interface PropertyGetData {
    _id: string,
    title: string
    description: string
    price: number
    gross: number
    net: number
    numberOfRoom: string
    buildingAge: number
    floor: number
    numberOfFloors: number
    heating: string
    numberOfBathrooms: number
    kitchen: string
    balcony: number
    lift: string
    parking: string
    furnished: string
    availability: string
    dues: number
    eligibleForLoan: string
    titleDeedStatus: string
    location: {
        city: string,
        district: string,
        neighborhood: string,
        geo: {
            type: string,
            coordinates: number[]
        }
    }
    propertyType: string
    listingType: string
    subType?: string
    selectedFeatures: string[]
    images: string[]
    user: {
        _id: string,
        name: string,
        surname: string,
        email: string,
        image: string,
        phonenumber: number,
        roles: string
    }
    createdAt: string
}