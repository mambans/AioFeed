echo "Started: `date`"

aws cloudformation deploy --template-file cloudformation.yaml --stack-name Notifies-frontend

set -e

npm run build

aws s3 sync --delete ./build s3://notifies.mambans.com

echo "Done: `date`"
