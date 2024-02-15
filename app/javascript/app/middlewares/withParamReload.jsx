import React from 'react';
 import { useParams } from "react-router-dom";

function WithParamReload(WrappedComponent,paramName) {
 return function (props){
     let params = useParams();
     return (
         <WrappedComponent {...props} key={params[paramName]} />
     );
 }

};

export default WithParamReload;