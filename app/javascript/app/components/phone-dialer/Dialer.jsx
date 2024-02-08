import React from 'react';
import HeadphonesIcon from "@mui/icons-material/Headphones";

const PhoneDialerLink = ({ phoneNumber }) => {
    const handleDialClick = () => {
        const telLink = `tel:${phoneNumber}`;
        window.location.href = telLink;
    };

    return (
        <section>
            <a href="tel:9918483161" className="btn btn-success">
                <HeadphonesIcon/>
            </a>
        </section>
    );
};

export default PhoneDialerLink;
