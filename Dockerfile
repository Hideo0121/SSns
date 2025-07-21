FROM php:8.3-fpm

WORKDIR /var/www/html

COPY . .

RUN apt-get update && apt-get install -y \
    nodejs npm \
    git unzip zip \
    libpq-dev \
    postgresql-client \
    && docker-php-ext-install pdo pdo_pgsql \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN npm install && npm run build

RUN composer install --optimize-autoloader --no-dev

EXPOSE 8080

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]