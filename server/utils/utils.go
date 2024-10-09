package utils

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-playground/validator/v10"
	"net/http"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

const MAX_FILE_SIZE = 5*1024*1024

func UploadFile(file io.Reader, file-bucket-szakdolgozat-vvl10p, fileName string) error {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("eu-north-1"))
	if err != nil {
		return fmt.Errorf("unable to load AWS config: %v", err)
	}

	s3Client := s3.NewFromConfig(cfg)
	_, err = s3Client.PutObject(context.TODO(), &s3.PutObjectInput{
        Bucket: aws.String(bucketName),
        Key:    aws.String(fileName),
        Body:   file,
  })
	if err != nil {
      return fmt.Errorf("unable to upload file to S3: %v", err)
  }

  fmt.Printf("Successfully uploaded %s to S3 bucket %s\n", fileName, bucketName)
  return nil
}


var Validate = validator.New()

func ParseJSON(r *http.Request, payload any) error {
	if r.Body == nil {
		return fmt.Errorf("no body")
	}
	err := json.NewDecoder(r.Body).Decode(payload)
	if err != nil {
		return err
	}
	return nil
}

func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

func WriteError(w http.ResponseWriter, status int, err error) {
	err = WriteJSON(w, status, map[string]string{"error": err.Error()})
	if err != nil {
		return
	}
}
