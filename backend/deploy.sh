#!/bin/bash

echo "Started: `date`"
set -e
aws cloudformation package --template-file cloudformation.yaml --s3-bucket aiofeed-backend --output-template-file cloudformation-packaged.yaml
aws cloudformation deploy --template-file cloudformation-packaged.yaml --stack-name aiofeed-backend --capabilities CAPABILITY_IAM
echo "Done: `date`"
