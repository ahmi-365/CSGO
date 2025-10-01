// app/components/ui/Input.tsx

"use client";

import React, { useState, InputHTMLAttributes, TextareaHTMLAttributes, FocusEvent } from 'react';

// Base props jo dono (input aur textarea) mein common hain
interface BaseInputProps {
    className?: string;
    inputClass?: string;
    labelClass?: string;
    label?: string;
    error?: string;
}

// Props jab component ek standard input ho
type StandardInputProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement> & {
    type?: 'text' | 'password' | 'email' | 'search' | 'number';
};

// Props jab component ek textarea ho
type TextareaInputProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement> & {
    type: 'textarea';
};

// Final Props type in dono ka union hai
type Props = StandardInputProps | TextareaInputProps;

export default function Input(props: Props) {
    const { type = 'text', className = "mb-3", label, labelClass, error, inputClass } = props;
    const [newType, setNewType] = useState(type);
    const [input_focus, set_input_focus] = useState(false);

    const togglePasswordVisibility = () => {
        setNewType((prev) => (prev === 'password' ? 'text' : 'password'));
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        set_input_focus(true);
        if (props.type === 'textarea' && props.onFocus) {
            props.onFocus(e as FocusEvent<HTMLTextAreaElement>);
        } else if (props.type !== 'textarea' && props.onFocus) {
            props.onFocus(e as FocusEvent<HTMLInputElement>);
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        set_input_focus(false);
        if (props.type === 'textarea' && props.onBlur) {
            props.onBlur(e as FocusEvent<HTMLTextAreaElement>);
        } else if (props.type !== 'textarea' && props.onBlur) {
            props.onBlur(e as FocusEvent<HTMLInputElement>);
        }
    };

    return (
        <div className={className}>
            {label &&
                <label htmlFor={props.id || props.name} className={`mb-1.5 block transition-all duration-300 ${input_focus ? 'text-white' : 'text-[#5D5F70]'} font-inter font-normal !leading-[160%] ${labelClass}`}>
                    {label}
                </label>
            }
            
            {props.type === 'textarea' ?
                (
                    <textarea
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={`px-3 md:px-4 py-3 w-full font-inter font-medium text-sm text-[#AEB0BD] placeholder:text-[#AEB0BD] border border-solid border-white/10 rounded-lg ${inputClass}`}
                        {...props}
                    />
                ) :
                (
                    <div className="relative">
                        <input
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            {...props}
                            type={newType}
                            className={`px-3 w-full font-inter font-medium text-sm bg-white/8 text-[#BFC0D8]/50 placeholder:text-[#BFC0D8]/50 rounded-xl min-h-12 ${props.type === "search" ? "pl-11.5" : ""} ${inputClass}`}
                        />
                        {props.type === 'password' &&
                            <button type="button" onClick={togglePasswordVisibility} className='absolute top-1/2 -translate-y-1/2 right-0 px-4'>
                                {newType === 'password' ?
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_2120_648)"><path d="M11.96 11.9601C10.8204 12.8288 9.4327 13.31 7.99996 13.31C3.33329 13.31 0.666626 8.0001 0.666626 8.0001C1.49589 6.45469 2.64605 5.1045 4.03996 4.0401M6.59996 2.82676C7.05885 2.71935 7.52867 2.66566 7.99996 2.66676C12.6666 2.66676 15.3333 8.0001 15.3333 8.0001C14.9286 8.75717 14.446 9.46992 13.8933 10.1268M9.41329 9.41343C9.2302 9.60993 9.00939 9.76753 8.76406 9.87685C8.51873 9.98616 8.2539 10.0449 7.98535 10.0497C7.71681 10.0544 7.45007 10.005 7.20103 9.90442C6.952 9.80383 6.72577 9.65412 6.53586 9.4642C6.34594 9.27428 6.19622 9.04806 6.09563 8.79902C5.99504 8.54999 5.94564 8.28324 5.95038 8.0147C5.95512 7.74616 6.0139 7.48133 6.12321 7.236C6.23252 6.99066 6.39013 6.76986 6.58663 6.58676" stroke="white" strokeOpacity={.6} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M0.666626 0.666748L15.3333 15.3334" stroke="white" strokeOpacity={.6} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></g><defs><clipPath id="clip0_2120_648"><rect width="16" height="16" fill="white" /></clipPath></defs></svg>
                                    :
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_2120_648)"><path d="M11.96 11.9601C10.8204 12.8288 9.4327 13.31 7.99996 13.31C3.33329 13.31 0.666626 8.0001 0.666626 8.0001C1.49589 6.45469 2.64605 5.1045 4.03996 4.0401M6.59996 2.82676C7.05885 2.71935 7.52867 2.66566 7.99996 2.66676C12.6666 2.66676 15.3333 8.0001 15.3333 8.0001C14.9286 8.75717 14.446 9.46992 13.8933 10.1268M9.41329 9.41343C9.2302 9.60993 9.00939 9.76753 8.76406 9.87685C8.51873 9.98616 8.2539 10.0449 7.98535 10.0497C7.71681 10.0544 7.45007 10.005 7.20103 9.90442C6.952 9.80383 6.72577 9.65412 6.53586 9.4642C6.34594 9.27428 6.19622 9.04806 6.09563 8.79902C5.99504 8.54999 5.94564 8.28324 5.95038 8.0147C5.95512 7.74616 6.0139 7.48133 6.12321 7.236C6.23252 6.99066 6.39013 6.76986 6.58663 6.58676" stroke="white" strokeOpacity={.6} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></g><defs><clipPath id="clip0_2120_648"><rect width="16" height="16" fill="white" /></clipPath></defs></svg>
                                }
                            </button>
                        }
                        {/* Search icon waghera... */}
                    </div>
                )
            }
            {error && <span className='text-xs italic font-inter font-normal text-red-400 mt-1 block'>{error}</span>}
        </div>
    );
}