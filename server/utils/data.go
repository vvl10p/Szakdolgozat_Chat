package utils

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"log"
	"os"
	"strings"
)

type FileMetaData struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

func UploadFile(file []byte, fileData string) (string, error) {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	Bucket := os.Getenv("S3_BUCKET")
	S3Key := os.Getenv("S3_KEY")
	S3Secret := os.Getenv("S3_SECRET")

	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("eu-north-1"), config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(S3Key, S3Secret, "")))
	if err != nil {
		fmt.Printf("unable to load SDK config, %v", err)
	}

	client := s3.NewFromConfig(cfg)

	var metaData FileMetaData
	err = json.Unmarshal([]byte(fileData), &metaData)
	if err != nil {
		return "", err
	}

	reader := bytes.NewReader(file)
	fileKey := uuid.New().String()

	lastDot := strings.LastIndex(metaData.Name, ".")
	if lastDot == -1 {
		fmt.Println("No '.' found")
		return "", err
	}
	fileKey = fileKey + "." + metaData.Name[lastDot+1:]

	params := &s3.PutObjectInput{
		Bucket:             aws.String(Bucket),
		Key:                aws.String(fileKey),
		Body:               reader,
		ContentDisposition: aws.String(metaData.Name),
		ContentType:        aws.String(metaData.Type),
		ACL:                types.ObjectCannedACLPublicRead,
	}

	_, err = client.PutObject(context.Background(), params)
	if err != nil {
		return "", err
	}
	fmt.Printf("file uploaded to bucket %s\n", Bucket)

	url := fmt.Sprintf("https://%s.s3.amazonaws.com/%s", Bucket, fileKey)
	return url, nil
}
