#! /bin/bash

sudo apt-get install -y  jq

# Assumes two input arguments
SHA1=$1
ENV=$2
APP_NAME="Routific-UrlShortener"
EB_BUCKET=ecs-routific

echo "Deploying $APP_NAME to Elastic Beanstalk"
# Create new Elastic Beanstalk version
DOCKERRUN_ZIP=$SHA1-$ENV-deployment-routific-nus.zip
npm install
zip -q -r ../$DOCKERRUN_ZIP * .ebextensions/* .node_module/*
cd ../
aws s3 cp $DOCKERRUN_ZIP s3://$EB_BUCKET/$DOCKERRUN_ZIP
aws elasticbeanstalk create-application-version --application-name $APP_NAME \
    --version-label $SHA1 --source-bundle S3Bucket=$EB_BUCKET,S3Key=$DOCKERRUN_ZIP

ENV_NAME=routificUrlShortener
if [ "$ENV" = "Production" ]; then
  ENV_NAME="$ENV_NAME-Prod"
else
  echo "$ENV not recognized as an environment"
  exit 1
fi

# Update Elastic Beanstalk environment to new version
aws elasticbeanstalk update-environment --environment-name $ENV_NAME --version-label $SHA1
echo "Sleeping for 5 minutes to check deployed version"
sleep 300
# Wait for deployment and check version
echo "Fetching deployed version labels"
export node_env=`aws elasticbeanstalk describe-environments --environment-names=$ENV_NAME  | jq '.[][].VersionLabel' | sed -e 's/^"//'  -e 's/"$//'`

echo "SHA1 $SHA1"
echo "ENV $ENV"
echo "NODE_ENV $node_env"

if [ "$node_env" != "$SHA1" ]; then exit 1 ; fi
