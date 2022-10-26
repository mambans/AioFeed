echo "\e[32mDeploy Started: `date`\e[0m"

aws cloudformation deploy --template-file cloudformation.yaml --stack-name aiofeed-frontend --no-fail-on-empty-changeset

# set -e

npm run build

aws s3 sync --delete ./build s3://aiofeed.com

echo "\e[42mDeploy Done: `date`\e[0m"
