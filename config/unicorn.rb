# /config/unicorn.rb

worker_processes ENV["UNICORN_COUNT"] && ENV["UNICORN_COUNT"].to_i || 3
timeout ENV["UNICORN_TIMEOUT"] && ENV["UNICORN_TIMEOUT"].to_i || 30
preload_app true

before_fork do |server, worker|
  # Replace with MongoDB or whatever
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.connection.disconnect!
    Rails.logger.info('Disconnected from ActiveRecord')
  end

  # # If you are using Redis but not Resque, change this
  # if defined?(Resque)
  # Resque.redis.quit
  # Rails.logger.info('Disconnected from Redis')
  # end

  sleep 1
end

after_fork do |server, worker|
  # Replace with MongoDB or whatever
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.establish_connection
    Rails.logger.info('Connected to ActiveRecord')
  end

  # # If you are using Redis but not Resque, change this
  # if defined?(Resque)
  # Resque.redis = ENV['REDIS_URI']
  # Rails.logger.info('Connected to Redis')
  # end
end