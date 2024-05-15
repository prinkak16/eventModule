import React, {useState, useEffect} from "react"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {getContributors} from "../../../services/CommonServices/commonServices";

export default function SharedSlider() {
    const [contributorsData, setContributorsData] = useState([])
    const handleContributorsData = ()=>{
        getContributors().then(data => {
            setContributorsData(Object.values(data.data)[0])
        });
    }
    useEffect(() => {
        handleContributorsData()
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 10000,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear',

    };
    console.log('contributor', contributorsData)
    return(
        <Slider {...settings}>
            {(contributorsData && contributorsData.length > 0) && contributorsData.map((contributor, index) => (
                <div>
                    <h3 key={index}>{contributor.name}</h3>
                </div>
            ))}
        </Slider>
    )
}