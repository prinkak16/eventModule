class MobileRedirectHandler
  def initialize(app)
    @app = app
  end

  def call(env)
    req = ActionDispatch::Request.new(env)
    if env['REQUEST_PATH'].ends_with?('/sso_client/callback') && req[:redirect_for] == "mobile"
      env['rack.session'][:redirect_for] = 'mobile'
    end

    @app.call(env)
  end
end