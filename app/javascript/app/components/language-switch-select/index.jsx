import React from 'react';
/*
import { useContext } from "react";
import { LanguageContext } from "../../provider/language-provider";*/
import {EventState} from "../../EventContext";

function LangaugeSwitchSelect({ supportedLanguages }) {
    const {globalSelectedLanguage,setGlobalSelectedLanguage}=EventState();
    /*const { lang, setLang } = useContext(LanguageContext);
    if (!supportedLanguages?.length) {
        return null;
    }*/

    const handleChange = (e) => {
        const {value}=e?.target;
        console.log('global language is ',value);
        setGlobalSelectedLanguage(value);
    };

    return (
        <div className="flex items-center justify-end">
            <label
                htmlFor="language"
                className="px-2 py-3 rounded-lg border border-gray-300 flex bg-white w-36	overflow-hidden shrink-0"
            >

                <select
                    id="language"
                    className="w-full"
                    onChange={handleChange}
                    value={lang}
                >
                    {supportedLanguages?.map((lang) => {
                        return (
                            <option value={lang.lang} key={lang.lang}>
                                {(lang.name ?? "").toUpperCase()}
                            </option>
                        );
                    })}
                </select>
            </label>
        </div>
    );
}

export default LangaugeSwitchSelect;
