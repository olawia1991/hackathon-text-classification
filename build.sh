docker build \
  --build-arg AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
  --build-arg AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
  --build-arg UNSPLASH_ACCESS_KEY_ID=${UNSPLASH_ACCESS_KEY_ID} \
  --build-arg PEXELS_API_KEY=${PEXELS_API_KEY} \
    -t hackathon-text-classification .