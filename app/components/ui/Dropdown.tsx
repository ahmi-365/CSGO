"use client"
import { useState, useEffect, useRef } from 'react'
import { arrow_down } from '../../utilities/Icons';

interface Item {
  icon?: string;
  name?: string;
  color?: string;
}

interface Props {
  className?: string;
  label?: string;
  required?: boolean;
  items: Item[];
  placeholder?: string | Item;
  btnClass?: string;
  dropdownClass?: string;
  id?: string;
  leftIcon?: React.ReactNode;
  dropdownPosition?: "top" | "bottom";
}

export default function Dropdown({ className = "", label, required, items = [], placeholder, btnClass = "min-h-11 md:min-h-12", dropdownClass = "left-0 w-full", leftIcon, id, dropdownPosition = "bottom" }: Props) {
  const [defaultItem, setDefaultItem] = useState<Item>({ name: 'Select' });
  const [isOpen, setIsOpen] = useState(false);

  console.log(items[0]);


  useEffect(() => {
    setDefaultItem(typeof placeholder === 'string'
      ? items[0]
      : placeholder || { name: 'Select' }
    );
  }, [placeholder]);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const selectItem = (item: Item) => {
    setDefaultItem(item);
    setIsOpen(false);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutSideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    window.addEventListener('click', handleOutSideClick);
    return () => {
      window.removeEventListener('click', handleOutSideClick);
    }
  }, [])


  return (
    <div ref={dropdownRef} className={`${className}`}>
      {label && (
        <label htmlFor={id} className='mb-2 block text-sm font-inter font-normal !leading-[160%]'>
          {label}
          {required && '*'}
        </label>
      )}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className={`w-full px-4 py-3 border border-solid border-white/8 rounded-xl flex items-center gap-2.5 justify-between font-medium text-sm !leading-[120%] bg-white/8 text-white ${btnClass}`}
        >
          <span className="flex items-center gap-2">
            {leftIcon &&
              <span>{leftIcon}</span>
            }
            {defaultItem.color &&
              <span className='size-3.5 rounded' style={{ backgroundColor: defaultItem.color }} />
            }
            <span className='line-clamp-1 text-left'>
              {defaultItem.name}
            </span>
          </span>
          <span className={`flex-none size-5 relative top-0.5 flex items-center justify-center ${isOpen ? '-scale-y-100' : 'scale-y-100'}`}>
            {arrow_down}
          </span>
        </button>

        {isOpen && (
          <div
            className={`absolute ${dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} border border-solid border-white/8 shadow-md rounded-lg px-1 py-2 bg-white/4 backdrop-blur-xl max-h-75 overflow-y-auto z-1 ${dropdownClass}`}
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => selectItem(item)}
                className={`
                  mb-1 last:mb-0 flex items-center w-full gap-2 py-2 px-3 text-sm rounded-lg hover:bg-[#171925]/16 hover:bg-stroke font-medium hover:text-white
                  ${item.color ? 'min-h-11 bg-[#171925]/16 rounded-xl' : null}
                   ${item.name === defaultItem.name ? 'text-white font-bold bg-[#171925]/16' : 'text-white/70 bg-transparent'}`}
              >
                {item.color &&
                  <span className='size-3.5 rounded block' style={{ backgroundColor: item.color }} />
                }
                <span className='line-clamp-1'>{item.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
