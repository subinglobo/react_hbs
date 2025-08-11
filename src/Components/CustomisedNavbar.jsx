
import React from 'react';

const CustomisedNavbar = () => {
    return (
        <>
            <header>
                <img src="" alt="logo" className='logo' />
                <div className='flex gap-2'>
                    <div className="search_bar">
                        <input type="text" placeholder="Search" />
                        <button type="submit" className='cursor-pointer'>
                            <img src="" alt="search icon" />
                        </button>
                        
                    </div>
                    <button className='cursor-pointer'><img src="" alt="audio" /></button>
                </div>

                <div className="top-buttons">
                    <ul>
                        <li><a href="#"><img src="" alt="" /></a></li>
                        <li><a href="#"><img src="" alt="" /></a></li>
                    </ul>
                </div>
            </header>
        </>
    )
}

export default CustomisedNavbar;
