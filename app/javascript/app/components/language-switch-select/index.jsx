import React from 'react';
/*
import { useContext } from "react";
import { LanguageContext } from "../../provider/language-provider";*/
import {EventState} from "../../EventContext";
import {LanguageIcon} from "../../assests/svg";
import './index.scss'
import {useTranslation} from "react-i18next";


function LangaugeSwitchSelect({supportedLanguages}) {
    const {i18n } = useTranslation();
    const {globalSelectedLanguage, setGlobalSelectedLanguage} = EventState();

    const handleChange = (e) => {
        const {value} = e?.target;
        i18n.changeLanguage(value);
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
