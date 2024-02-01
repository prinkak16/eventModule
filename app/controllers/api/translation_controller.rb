class Api::TranslationController < ApplicationController

  def fetch_languages
    begin
      languages = [{
                     "lang": "hn",
                     "name": "Hindi",
                     "value": ""
                   },
                   {
                     "lang": "mr",
                     "name": "Marathi",
                     "value": ""
                   },
                   {
                     "lang": "te",
                     "name": "Telugu",
                     "value": ""
                   },
                   {
                     "lang": "kn",
                     "name": "Kannada",
                     "value": ""
                   },
                   {
                     "lang": "ta",
                     "name": "Tamil",
                     "value": ""
                   },
                   {
                     "lang": "bn",
                     "name": "Bengali",
                     "value": ""
                   },
                   {
                     "lang": "or",
                     "name": "Odia",
                     "value": ""
                   },
                   {
                     "lang": "gu",
                     "name": "Gujarati",
                     "value": ""
                   },
                   {
                     "lang": "pa",
                     "name": "Punjabi",
                     "value": ""
                   },
                   {
                     "lang": "ml",
                     "name": "Malayalam",
                     "value": ""
                   },
                   {
                     "lang": "as",
                     "name": "Assamese",
                     "value": ""
                   }]
      render json: { success: true, message: "Request Processed Successfully", data: languages }, status: :ok
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

end