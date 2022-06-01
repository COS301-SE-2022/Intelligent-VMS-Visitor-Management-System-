import React, { useEffect, useRef, useState, setState } from "react";
import Layout from "./Layout";

const SignInPopUp = ({showCondition}) => {
    const videoRef = useRef(null);
    const [data, setData] = useState('No result');

    return (
      
      <div className="max-w-md shadow-lg grid grid-cols-1 overflow-hidden bg-base-300">
          
          <svg
            xmlns="http://www.w3.org/2000/svg" 
	          viewBox="0 0 500 500" 
            className="w-3/5 h-3/5 stroke-current shadow-lg"
            >
              <circle className="fill-primary m-12 stroke-primary" cy="50%" cx="50%" r="150" />
              <path className="fill-secondary stroke-secondary" d="M231.634,79.976v-0.751C231.634,30.181,192.772,0,137.32,0c-31.987,0-57.415,9.018-77.784,22.98
              c-11.841,8.115-12.907,25.906-4.232,37.355l6.326,8.349c8.675,11.444,24.209,12.532,36.784,5.586
              c11.46-6.331,23.083-9.758,34-9.758c18.107,0,28.294,7.919,28.294,20.75v0.375c0,16.225-15.469,39.411-59.231,43.181l-1.507,1.697
              c-0.832,0.936,0.218,13.212,2.339,27.413l1.741,11.58c2.121,14.201,14.065,25.71,26.668,25.71s23.839-5.406,25.08-12.069
              c1.256-6.668,2.268-12.075,2.268-12.075C199.935,160.882,231.634,127.513,231.634,79.976z"/>
              <path className="fill-secondary stroke-secondary" d="M118.42,217.095c-14.359,0-25.993,11.64-25.993,25.999v12.14c0,14.359,11.64,25.999,25.993,25.999
              h22.322c14.359,0,25.999-11.64,25.999-25.999v-12.14c0-14.359-11.645-25.999-25.999-25.999H118.42z"/>
              
            </svg>
          <h1 className="font-bold text-center text-3xl">Confirm Sign-in</h1>
          <p>Confirm sign-in of visitor with id 0012120178087</p>
          <input type="text" placeholder="Add some observations.." class="input input-bordered w-5/6" />
          <button class="btn btn-primary w-5/6">Sign in</button>
      </div>
    );
};

export default SignInPopUp;
