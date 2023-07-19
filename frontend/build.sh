npm  install
npm run build
aws s3 rm --recursive s3://sumlong2/static
aws s3 cp --recursive ./build s3://sumlong2/
aws cloudfront create-invalidation --distribution-id E1DGCYAQ2ZNLA3 --paths "/*"
echo ""
echo "Done! go to : https://dh4onp0fvmvf4.cloudfront.net/"