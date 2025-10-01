import React from 'react'

type Props = {
    children?: React.ReactNode;
    className?: string;
}

export default function PageContainer({ children, className = '' }: Props) {
    return (
        <div className={`px-4 mx-auto ${className.includes('my-') ? '' : 'my-6 md:my-8 lg:my-10'} ${className.includes('max-w-') ? '' : 'max-w-333'} ${className}`}>
            {children}
        </div>
    )
}