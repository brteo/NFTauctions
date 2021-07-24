printf "[S3] init\n"

readonly LOCALSTACK_S3_URL=http://localstack:4566
readonly DATA_BUCKET_NAME="data"
readonly TMP_BUCKET_NAME="tmp"

set -x

aws configure set aws_access_key_id awstest
aws configure set aws_secret_access_key awstest
echo "[default]" >~/.aws/config
echo "region = eu-central-1" >>~/.aws/config
echo "output = json" >>~/.aws/config

{ # try
	aws --endpoint-url=$LOCALSTACK_S3_URL s3 mb s3://$DATA_BUCKET_NAME
	aws --endpoint-url=$LOCALSTACK_S3_URL s3api put-bucket-acl --bucket $DATA_BUCKET_NAME --acl private
	aws --endpoint-url=$LOCALSTACK_S3_URL s3 mb s3://$TMP_BUCKET_NAME
	aws --endpoint-url=$LOCALSTACK_S3_URL s3api put-bucket-acl --bucket $TMP_BUCKET_NAME --acl private
} || { # catch
	printf "[S3] Bucket Already exist\n"
}

printf "[S3] seed images\n"

aws --endpoint-url=$LOCALSTACK_S3_URL s3 sync /seed s3://$DATA_BUCKET_NAME --acl public-read

printf "[S3] http://localhost:4566/health\n\n"
