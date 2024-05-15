import React from "react"
import "./userCards.scss"
export default function UserCards({cardTitle,reportCount }) {
    return(
        <>
            <div className="cards-wrap">
                <h4>{cardTitle}</h4>
                <h3>{reportCount}</h3>
            </div>
        </>
    )
}