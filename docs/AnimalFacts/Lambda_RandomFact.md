# Random Fact Function


## Step 1: Creating a Lambda Function
Navigate to the [Lambda](https://console.aws.amazon.com/lambda/home) dashboard and from here just click the **Create Function** button. We will be again be authoring an app from scratch so leave that selected, for the name we'll call this one 'Twitch-AnimalFacts-RandomFact', change the runtime to Go 1.x, and for the execution role we will create a new one from a template and just call it 'Basic-Lambda', and search for the Policy Template "Basic Lambda@Edge permissions (for CloudFront trigger)" which will provide us the permission to execute the function and allow it to write logs to Cloudwatch.


## Step 2: Setting environment variables
To verify JWT tokens we will need to set values for env variable called 'secret', and we will also need 'ownerId' and 'clientId' variables for when it comes to broadcasting the new colour on Pubsub, so before we start coding scroll down to the environment variables section and enter your client secret that can be found on your Extensions management page in the Twitch Dev Dashboard.

![ENV Var](/docs/images/Lambda-ENV-2.png)


## Step 3: Code
The full code for the tutorial can be found in the '/src/twitch-animalfacts-randomfact' directory of this project, along with the zip you can upload to Lambda that contains the compiled function for you. While this code is almost entirely based on the original code from the Animal Facts extension these are some of the changes that had to be made for it to work on Lambda.

In the example EBS the Global Segment is set when it runs and then is never called again unless the app is restarted, which is not a problem for an always-on app but for a Lambda function this will be called every single time a request is sent to the API endpoint. To work around this I created a simple check whereby if an 'init' value is set (which we will trigger when we test the function) it will set the Global Segment, but for anything requests coming from the frontend it will ignore this and instead proceed with generating a new animal fact.

```go
if gjson.Get(string(evt), "init").Bool() {
	fmt.Println("Extension Initialization")
	configurationClient.SetGlobalSegment(factsClient.GetDefaultFact())
	return returnVal, nil
}
```

As code complexity grows it is beneficial to split off 'initialization' code into their own Lambda functions, but for this Tutorial things are simplified by keeping it into a single function.

Another change that I've made to the code is to how the original EBS dealt with requests where it would call the Get Broadcaster Segment endpoint on Twitch to get the type of animal that it will generate a random fact for. The problem with this approach is that the frontend sets this value and then calls the EBS immediately after so would often run into a problem where the EBS's API request would receive cached data and so incorrectly use the previously set animal to generate facts for rather than the new selection. While from a learning point of view the original EBS does act as an example of how to make such requests, in this tutorial I'll instead have the frontend include the new animal type in the EBS request and use the following code to in the EBS to use that rather than make an API request to Twitch. 

```go
animalType := gjson.Get(string(evt), "body").String()
```

The changes to the frontend will be specified in the API Gateway section of this tutorial. There are also some other changes, such as removing the HTTP server as that is no longer needed as API Gateway will handle that, and some minor changes to how JWT tokens are handled that can be seen by viewing the src files.


## Step 4: Build and Upload
To build the Go function that will work on Lambda we need to set the following environment variables: `GOOS=linux`, `env=GOARCH`, and `CGO_ENABLED=0`. In addition to this, if developing on Windows it can also be problematic to mark the binary as executable so AWS have released a 'build-lambda-zip' tool which can be downloaded using `go.exe get -u github.com/aws/aws-lambda-go/cmd/build-lambda-zip`

How you will build and zip your function will vary based on the OS you're developing on, as I'm writing this tutorial on Windows I'll show an example of how to do this in Windows Powershell but it should be sufficient to see how to do it. Alternatively you can just upload the included 'main.zip' in from the src files of this tutorial as that already contains the built executable.

```powershell
$env:GOOS = "linux"
$env:GOARCH = "amd64"
$env:CGO_ENABLED = "0"
go build -o main main.go jwt.go configuration.go facts.go
~\Go\Bin\build-lambda-zip.exe -o main.zip main
```

Now that we have a zip, from the 'Function Code' section of our Lambda function we can upload from a zip and select the zip (either the one included with these tutorial files, or creating your own), we need to also ensure that the handler is set to 'main' so that the function executes correctly, and then click 'Save' in the top right.


## Step 5: Initialization
To test that the function is working correctly, and initialize the EBS to set the Global Segment in the configuration service, we can create a test which we can simply call 'init' and the JSON data we will use with this event is:

```json
{
  "init": true
}
```

Now we can run this test and in the output there are 2 things to look for to ensure that it has worked. First will be the returned result, which should have a 200 status code and because this is a test and not an actual API request it is not important that the header is empty:

```json
{
  "statusCode": 200,
  "headers": {
    "Access-Control-Allow-Origin": ""
  },
  "body": ""
}
```

It will also show the log output at the bottom, which should show that the initialization section of code has been called and include the logged text:

```
Extension Initialization
SetGlobalSegment
```

Log output is also saved to CloudWatch Logs, we don't need to view this for our test as it shows the output on the Lambda page, but to check the logs from when our Lambda function is called from an API request the output will be logged there for us to check for any potential errors.


## Step 6: Next
Our final step to putting this EBS together is to use API Gateway to create the route that will proxy the incoming requests this  Lambda function [API Gateway Route](/docs/AnimalFacts/API_Gateway.md).