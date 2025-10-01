"use client"

import React, { useEffect, useState } from 'react'
import PageContainer from '@/app/components/PageContainer'
import Toster from '@/app/components/Toster'

type Props = {}

export default function page({ }: Props) {
    const [success, setSuccess] = useState(false)
    const [warning, setWarning] = useState(false)
    const [information, setInformation] = useState(false)
    const [error, setError] = useState(false)

    const alertsBtn = [
        {
            name: 'success',
            action: () => setSuccess(true),
        },
        {
            name: 'warning',
            action: () => setWarning(true),
        },
        {
            name: 'information',
            action: () => setInformation(true),
        },
        {
            name: 'error',
            action: () => setError(true),
        },
    ]
    useEffect(() => {
        setInterval(() => {
            setSuccess(false)
            setWarning(false)
            setInformation(false)
            setError(false)
        }, 6000)
    }, [])
    return (
        <PageContainer>
            <div className="flex items-center justify-center h-[80vh]">
                <div className="max-w-200 w-full flex items-center justify-center gap-4">
                    {alertsBtn.map((item, index) => (
                        <button onClick={item.action} key={index} className='flex items-center min-h-12 px-8 text-white rounded-full capitalize text-lg bg-white/6 hover:bg-primary/15'>{item.name}</button>
                    ))}
                    {success &&
                        <Toster
                            variant='success'
                            title="Successful"
                            description='Your Crypto deposit Successful!'
                            duration={3000}
                            onClick={() => setSuccess(false)}
                        />
                    }
                    {warning &&
                        <Toster
                            variant='warning'
                            title="Under Review"
                            description='Your payment will take 24 hours, to under review.'
                            duration={3000}
                            onClick={() => setWarning(false)}
                        />
                    }
                    {information &&
                        <Toster
                            variant='information'
                            title="Information"
                            description='Anyone with a link can now view this file.'
                            duration={3000}
                            onClick={() => setInformation(false)}
                        />
                    }
                    {error &&
                        <Toster
                            variant='error'
                            title="Error"
                            description='Anyone with a link can now view this file.'
                            duration={3000}
                            onClick={() => setError(false)}
                        />
                    }
                </div>
            </div>
        </PageContainer>
    )
}