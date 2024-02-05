import React, {useState,useEffect} from 'react';
/*
import { useContext } from "react";
import { LanguageContext } from "../../provider/language-provider";*/
import {EventState} from "../../EventContext";
import {LanguageIcon} from "../../assests/svg";
import './index.scss'
import {useTranslation} from "react-i18next";
import {getAllLanguages} from "../../services/CommonServices/commonServices";
import {toast} from "react-toastify";


function LangaugeSwitchSelect() {
    const {i18n } = useTranslation();
    const {globalSelectedLanguage, setGlobalSelectedLanguage} = EventState();
    const [supportedLanguages,setSupportedLanguages]=useState([]);

    const handleChange = (e) => {
        const {value} = e?.target;
        i18n.changeLanguage(value);
        setGlobalSelectedLanguage(value);
        localStorage.setItem('userLanguage',value);
    };

    const fetchLanguages=async ()=>{
        try {
            const {data}=await getAllLanguages();
            //sorted the languages in  ascending order
            setSupportedLanguages(data?.data?.sort((a,b)=>a.name.localeCompare(b.name))??[]);
        }catch (e) {
            toast.error(e?.message);
        }

    }

    useEffect(()=>{
        fetchLanguages();
        //checking whether there exists already selected language in local storage
        const userLang=localStorage.getItem('userLanguage');
        if(userLang){
            setGlobalSelectedLanguage(userLang);
        }
    },[]);


    return (
        <div className="language-select-main-container">
            <label
                htmlFor="language"
                className={"inner-container"}
            >
                <div className={"language-icon-container"} id={"language"}>
                    <LanguageIcon className={"language-icon"} id={"language"}/>
                </div>
                <select
                    id="language"
                    onChange={handleChange}
                    value={globalSelectedLanguage}
                    className={'select-styles'}
                >
                    {supportedLanguages?.map((lang) =>
                        <option value={lang?.lang} key={lang?.lang}>
                            {(lang?.name ?? "").toUpperCase()}
                        </option>
                    )}
                </select>
            </label>
        </div>
    );
}

export default LangaugeSwitchSelect;
