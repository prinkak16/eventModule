import React from 'react';
/*
import { useContext } from "react";
import { LanguageContext } from "../../provider/language-provider";*/
import {EventState} from "../../EventContext";
import {LanguageIcon} from "../../assests/svg";
import './index.scss'

function LangaugeSwitchSelect({supportedLanguages}) {
    const {globalSelectedLanguage, setGlobalSelectedLanguage} = EventState();
    /*const { lang, setLang } = useContext(LanguageContext);
    if (!supportedLanguages?.length) {
        return null;
    }*/

    const handleChange = (e) => {
        const {value} = e?.target;
        console.log('global language is ', value);
        setGlobalSelectedLanguage(value);
    };

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
