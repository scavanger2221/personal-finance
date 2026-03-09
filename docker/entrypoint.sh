#!/bin/sh
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "${GREEN}=== Laravel Container Initialization ===${NC}"

# Wait for database to be ready
echo "${YELLOW}Waiting for database...${NC}"
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" > /dev/null 2>&1; do
    echo "${YELLOW}Database is unavailable - sleeping${NC}"
    sleep 1
done
echo "${GREEN}Database is up!${NC}"

# Create storage directories if they don't exist
echo "${YELLOW}Setting up storage directories...${NC}"
mkdir -p storage/framework/cache/data
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/framework/testing
mkdir -p storage/logs
mkdir -p storage/app/public
mkdir -p storage/app/private

# Fix permissions
echo "${YELLOW}Fixing permissions...${NC}"
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/public/build 2>/dev/null || true
chmod -R 775 /var/www/storage /var/www/bootstrap/cache 2>/dev/null || true

# Install composer dependencies if vendor doesn't exist
if [ ! -d "vendor" ] || [ ! -f "vendor/autoload.php" ]; then
    echo "${YELLOW}Installing Composer dependencies...${NC}"
    composer install --no-interaction --optimize-autoloader --no-dev
fi

# Generate app key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    echo "${YELLOW}Generating application key...${NC}"
    php artisan key:generate
fi

# Run migrations
echo "${YELLOW}Running database migrations...${NC}"
php artisan migrate --force --no-interaction

# Clear and cache config
echo "${YELLOW}Caching configuration...${NC}"
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Install npm dependencies and build if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "${YELLOW}Installing NPM dependencies...${NC}"
    npm ci
    echo "${YELLOW}Building frontend assets...${NC}"
    npm run build
fi

echo "${GREEN}=== Initialization Complete! ===${NC}"
echo "${GREEN}Starting PHP-FPM...${NC}"

# Start PHP-FPM
exec php-fpm
