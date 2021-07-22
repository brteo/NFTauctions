printf "[S3] init\n"

readonly LOCALSTACK_S3_URL=http://localstack:4566

set -x

aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
echo "[default]" >~/.aws/config
echo "region = ${AWS_SES_REGION}" >>~/.aws/config
echo "output = json" >>~/.aws/config

{ # try
	aws --endpoint-url=$LOCALSTACK_S3_URL s3 mb s3://${AWS_S3_BUCKET_NAME}
	aws --endpoint-url=$LOCALSTACK_S3_URL s3api put-bucket-acl --bucket ${AWS_S3_BUCKET_NAME} --acl private
} || { # catch
	printf "[S3] Bucket Already exist\n"
}

printf "[S3] seed images\n"

aws --endpoint-url=$LOCALSTACK_S3_URL s3 sync /seed s3://${AWS_S3_BUCKET_NAME} --acl public-read

printf "[S3] http://localhost:4566/health\n\n"
