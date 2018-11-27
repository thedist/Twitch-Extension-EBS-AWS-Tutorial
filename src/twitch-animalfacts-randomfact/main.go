/**
 *    Copyright 2018 Amazon.com, Inc. or its affiliates
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/tidwall/gjson"
	"net/http"
	"os"
)

var (
	configurationClient *ConfigurationServiceClient
	factsClient         *FactsServiceClient
)

func main() {
	lambda.Start(Handler)
}

func Handler(ctx context.Context, evt json.RawMessage) (events.APIGatewayProxyResponse, error) {
	returnVal := events.APIGatewayProxyResponse{
		Body:       "",
		StatusCode: 200,
		Headers:    map[string]string{"Access-Control-Allow-Origin": gjson.Get(string(evt), "headers.origin").String()},
	}

	configurationClient = &ConfigurationServiceClient{
		client:   &http.Client{},
		clientID: os.Getenv("EXT_CLIENT_ID"),
	}

	factsClient = &FactsServiceClient{}

	if gjson.Get(string(evt), "init").Bool() {
		fmt.Println("Extension Initialization")
		configurationClient.SetGlobalSegment(factsClient.GetDefaultFact())
		return returnVal, nil
	}

	token := gjson.Get(string(evt), "headers.Authorization").String()
	jwtToken, err := VerifyJWT(token)
	if err != nil {
		returnVal.Body = err.Error()
		returnVal.StatusCode = 403
		return returnVal, nil
	}

	channelID := jwtToken.ChannelID

	animalType := gjson.Get(string(evt), "body").String()
	animalFact := factsClient.GetRandomFact(AnimalType(animalType))
	fmt.Println(animalType, animalFact)

	configurationClient.SetDeveloperSegment(channelID, animalFact)
	return returnVal, nil
}
