import React from 'react';
import { Toolbar, Select, MenuItem, Icon } from '@material-ui/core';
import './header.scss'; // Import your CSS file

const HeaderBar = ({ isSaralUser = '', language = '', languages = '', userName = 'Ram Avtar' }) => {
    return (
        <Toolbar className="header-bg" id="header">
            {/* Navbar Container Start */}
            {/* Left Content of Navbar Start */}
            <div className="left-header-container">
                <img src="/assets/images/BJP-logo%20(1).png" alt="" className="header-img" />
                <span className="navbar-header-title"> भारतीय जनता पार्टी </span>
            </div>
            {!isSaralUser && (
                <>
                    <div className="language-setting-container mt-3">
                        {/*<Select*/}
                        {/*    className="select-language"*/}
                        {/*    variant="outlined"*/}
                        {/*    value={language}*/}
                        {/*    placeholder="Change Language"*/}
                        {/*>*/}
                        {/*    {languages && languages.map((language) => (*/}
                        {/*        <MenuItem key={language.value} value={language.value}>*/}
                        {/*            {language.viewValue}*/}
                        {/*        </MenuItem>*/}
                        {/*    ))}*/}
                        {/*</Select>*/}
                    </div>
                    <div className="right-header-content">
                        <div className="user-profile-container">
                            {/*<img src="/assets/images/Avtar.png" alt="" className="user-header-image" />*/}
                            <span className="user-name">{userName}</span>
                        </div>

                        {/* Only Screen For Mobile */}
                        <div className="user-profile-container-mobile">{/* Mobile content */}</div>
                    </div>
                </>
            )}
            {/* Right Content of Navbar End */}
            {/* Navbar Container End */}
        </Toolbar>
    );
};

export default HeaderBar;
