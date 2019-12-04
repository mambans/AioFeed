aws cloudformation package --template-file cloudformation.yaml --s3-bucket rp-deployment --output-template-file cloudformation-packaged.yaml
aws cloudformation deploy --template-file cloudformation-packaged.yaml --stack-name Notifies --capabilities CAPABILITY_IAM
