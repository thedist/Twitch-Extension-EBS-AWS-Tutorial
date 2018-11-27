# Animal Facts
The Animal Facts extension is designed as a simple example on how to use the Extension Configuration Service, with the EBS written in Golang. Firstly the EBS sets the Global Segment with an animal fact, then it handles incoming requests which are triggered by the saving the config page in the frontend and sets a new animal fact for that channel.

The resources required for this EBS are simpler than that of the Hello World because there is a single API endpoint that will be called, and because there is no need for a database this simplifies creating a role that can execute the Lambda function too so we can create this EBS simply by making some minor modifications to the Golang code provided in the sample extension, building/zipping it to be able to run on Lambda, creating a basic Lambda Execution role within Lambda itself, and finally a single resource/method API Gateway to proxy requests to the Lambda function.


## [Random Fact Function](/docs/AnimalFacts/Lambda_RandomFact.md)
Just as the sample EBS is written in Golang so to will this Lambda function. Special thanks go out to the original developers/contributors of the extension as my experience with the language is somewhat limited so this tutorial will be largely based on that original code, with some modifications made to make it suitable for this use case.


## [API Gateway Routes](/docs/AnimalFacts/API_Gateway.md)
API Gateway will provide us the endpoint we need that will proxy the requests from clients on to our Lambda function. We will also need to update the frontend of the Animal Facts extension so that requests are made to the URL provided rather than attempting to send requests to localhost, and also so that the requests are sent as a POST and include the new animal type selected in the saved config.