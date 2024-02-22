uri = URI.parse(ENV["REDIS_URL"])
REDIS_CLIENT_APP = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)