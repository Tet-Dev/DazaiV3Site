#!/bin/bash

# Recursively find all JPG and PNG images
images=($(find -P . -name "*.jpeg"))

# Loop through each image and convert to WebP
for image in "${images[@]}"
do
  webp_image="${image%.*}.webp"
  cwebp "$image" -o "$webp_image"
done