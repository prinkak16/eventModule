class Api::TranslationController < ApplicationController

  def fetch_languages
    begin
      languages = ['English', 'Hindi', 'Marathi', 'Telugu', 'Kannada', 'Tamil', 'Bengali', 'Odia', 'Gujarati', 'Punjabi', 'Malayalam', 'Assamese'].freeze
      language_codes = ['en', 'hn', 'mr', 'te', 'kn', 'ta', 'bn', 'or', 'gu', 'pa', 'ml', 'as'].freeze
      render json: { success: true, message: "Request Processed Successfully", languages: languages, language_codes: language_codes }, status: :ok
    rescue => e
      render json: { success: false, message: e.message }, status: :bad_request
    end
  end

end