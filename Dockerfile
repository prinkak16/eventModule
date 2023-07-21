FROM ruby:3.2.0

RUN apt-get install -y libxml2-dev libxslt1-dev
RUN apt-get install -y zlib1g-dev liblzma-dev patch

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -y yarn
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash
RUN apt install nodejs -y
RUN apt autoremove -y

RUN apt-get update
RUN apt  install -y imagemagick libmagickwand-dev ghostscript
RUN apt install -y ffmpeg
COPY policy.xml /etc/ImageMagick-6/policy.xml
ENV REDIS_URL=redis://localhost:6379
ENV RAILS_ENV=production
ENV RACK_ENV=production
ARG _RAILS_MASTER_KEY
ENV RAILS_MASTER_KEY=$_RAILS_MASTER_KEY
ARG _ACCESS_TOKEN
ENV ACCESS_TOKEN=$_ACCESS_TOKEN

WORKDIR /usr/src/

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
