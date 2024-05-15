import React from "react"
export default function CommonHeading({sharedHeading}) {
    const heading={
        fontSize:"1.4rem",
        fontWeight:600
    }
    return(
        <>
            <h4 style={heading} className="mb-0">{sharedHeading}</h4>
        </>
    )
}