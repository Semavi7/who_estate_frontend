export default interface PropertySubmitData {
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
    location: string
    propertyType: string
    listingType: string
    subType?: string
    selectedFeatures?: string
}