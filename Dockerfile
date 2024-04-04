FROM ruby:3.2.0

RUN apt-get update && \
    apt-get install -y \
    libxml2-dev \
    libxslt1-dev \
    zlib1g-dev \
    liblzma-dev \
    patch \
    imagemagick \
    libmagickwand-dev \
    ghostscript \
    ffmpeg \
    curl && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash && \
    apt-get install -y yarn nodejs && \
    apt autoremove -y && \
    rm -rf /var/lib/apt/lists/*

COPY policy.xml /etc/ImageMagick-6/policy.xml
ENV REDIS_URL=redis://localhost:6379
ENV RAILS_ENV=production
ENV RACK_ENV=production
ARG _RAILS_MASTER_KEY
ENV RAILS_MASTER_KEY=$_RAILS_MASTER_KEY
ARG _ACCESS_TOKEN
ENV ACCESS_TOKEN=$_ACCESS_TOKEN
ARG _REDIS_PROVIDER
ENV REDIS_PROVIDER=$_REDIS_PROVIDER
ENV APP_HOME /home/Jarvis/app

RUN useradd -m -r -s /bin/bash Jarvis && \
    mkdir -p $APP_HOME && \
    chown -R Jarvis:Jarvis $APP_HOME && \
    chmod -R 755 $APP_HOME

# WORKDIR /usr/src/
WORKDIR ${APP_HOME}
COPY Gemfile Gemfile
#COPY Gemfile.lock Gemfile.lock
RUN bundle config github.com $ACCESS_TOKEN
COPY . .

#RUN yarn install --ignore-engines
RUN bundle install
#RUN bundle update saral-locatable

RUN bundle exec rails assets:precompile
EXPOSE 3000

# Configure the main process to run when running the image
CMD ["rails", "server", "-b", "0.0.0.0"]
