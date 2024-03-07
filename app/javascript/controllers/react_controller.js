import {Controller} from "@hotwired/stimulus"
import React from "react";
import {createRoot} from "react-dom/client";

import App from "../app/app";
import {BrowserRouter} from "react-router-dom";
import EventContext from "../app/context/EventContext";
import '../app/i18n'
export default class extends Controller {
    connect() {
        const app = document.getElementById("app");
        createRoot(app).render(<BrowserRouter basename={"/"}>
            <EventContext>
                <App/>
            </EventContext>
        </BrowserRouter>)
    }
}
