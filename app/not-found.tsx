import FuzzyText from '@/components/ui/FuzzyText'
import React from 'react'

const NotFound = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen gap-10'>
            <FuzzyText
                baseIntensity={0.2}
                hoverIntensity={0.5}
                enableHover={true}
                fontSize='200px'
            >
                404
            </FuzzyText>
            <FuzzyText
                baseIntensity={0.2}
                hoverIntensity={0.5}
                enableHover={true}
                fontSize='60px'
            >
                NOT FOUND
            </FuzzyText>
        </div>
    )
}

export default NotFound