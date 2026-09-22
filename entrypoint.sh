#!/bin/sh

# Gera o arquivo .env a partir das variáveis do ambiente
echo "Gerando arquivo .env a partir das variáveis do ambiente..."
echo "VITE_ENV=$VITE_ENV" > .env
echo "VITE_IMAGE_VERSION=$VITE_IMAGE_VERSION" >> .env
echo "VITE_URL_DOTCORE=$VITE_URL_DOTCORE" >> .env
echo "VITE_URL_AUTH_DOTCORE=$VITE_URL_AUTH_DOTCORE" >> .env
echo "VITE_PLATFORM=$VITE_PLATFORM" >> .env
echo "VITE_AES_KEY=$VITE_AES_KEY" >> .env
echo "VITE_AES_IV=$VITE_AES_IV" >> .env
echo "VITE_AES_IV=$VITE_URL_CRM_DOTCORE" >> .env
echo "VITE_THEME_FAVICON=$VITE_THEME_FAVICON" >> .env
echo "VITE_WS_PAYMENT_URL=$VITE_WS_PAYMENT_URL" >> .env
echo "VITE_THEME_BLOBS_KEY=$VITE_THEME_BLOBS_KEY" >> .env
echo "VITE_URL_API_CONVERT_TEMPLATE=$VITE_URL_API_CONVERT_TEMPLATE" >> .env
echo "VITE_DOCKER_PORT=$VITE_DOCKER_PORT" >> .env
echo "VITE_COMMUNICATIONHUB_URL=$VITE_COMMUNICATIONHUB_URL" >> .env
echo "VITE_IDPARCEIRO=$VITE_IDPARCEIRO" >> .env
echo ".env gerado com sucesso:"
cat .env
