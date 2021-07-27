printf "[S3] init\n"

readonly LOCALSTACK_S3_URL=http://localstack:4566
readonly BUCKET_DATA="data"
readonly BUCKET_TMP="tmp"

set -x

aws configure set aws_access_key_id awstest
aws configure set aws_secret_access_key awstest
echo "[default]" >~/.aws/config
echo "region = eu-central-1" >>~/.aws/config
echo "output = json" >>~/.aws/config

{ # try
	aws --endpoint-url=$LOCALSTACK_S3_URL s3 mb s3://$BUCKET_DATA
	aws --endpoint-url=$LOCALSTACK_S3_URL s3api put-bucket-acl --bucket $BUCKET_DATA --acl private
	aws --endpoint-url=$LOCALSTACK_S3_URL s3 mb s3://$BUCKET_TMP
	aws --endpoint-url=$LOCALSTACK_S3_URL s3api put-bucket-acl --bucket $BUCKET_TMP --acl private
} || { # catch
	printf "[S3] Bucket Already exist\n"
}

printf "[S3] seed images\n"

aws --endpoint-url=$LOCALSTACK_S3_URL s3 sync /seed s3://$BUCKET_DATA --acl public-read

printf "[S3] http://localhost:4566/health\n\n"
