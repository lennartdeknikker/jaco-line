#!/bin/bash
# Script to download social media icons and convert to WebP
# Requires: curl, imagemagick (for conversion) or you can use online tools

ICONS_DIR="app/static/icons"
mkdir -p "$ICONS_DIR"

echo "Downloading social media icons..."
echo ""
echo "You can download icons from:"
echo "1. Simple Icons: https://simpleicons.org/"
echo "2. Font Awesome: https://fontawesome.com/icons"
echo "3. Or use an online converter to convert SVG/PNG to WebP"
echo ""
echo "Platforms needed:"
echo "- facebook.webp"
echo "- twitter.webp"
echo "- linkedin.webp"
echo "- pinterest.webp"
echo "- tiktok.webp"
echo ""
echo "Place the WebP files in: $ICONS_DIR"
