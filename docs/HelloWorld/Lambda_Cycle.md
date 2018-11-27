# Cycle Colour Function
This Lambda function has similar parts to it as the query function, in that it has to verify the JWT token and retrieve channel data from DynamoDB, but it also needs to check if the user has requested a cycle recently to prevent abuse from a user and if the channel as a whole has had a cycle recently to prevent spamming broadcast requests. In a real-world scenario this is not the ideal way to create such a function, as more ideal solutions would be to use a mix of client-side restrictions to prevent spam requests ever being sent to the EBS, as well as the possibility of using API Gateway to throttle excessive requests. For the purpose of this tutorial though I've tried to stay as close to the original EBS service in the Hello World example as I could, while making some changes as needed for the stateless nature of Lambda.


## Step 1: Creating a Lambda Function
Navigate to the [Lambda](https://console.aws.amazon.com/lambda/home) dashboard and from here just click the **Create Function** button. We will be again be authoring an app from scratch so leave that selected, for the name we'll call this one 'Twitch-HelloWorld-Cycle', change the runtime to Node.js 8.10 and as use the same IAM role 'twitch-ext-helloworld'.


## Step 2: Setting environment variables
To verify JWT tokens we will need to set an env variable called 'secret', and we will also need 'ownerId' and 'clientId' variables for when it comes to broadcasting the new colour on Pubsub, so before we start coding scroll down to the environment variables section and enter your client secret that can be found on your Extensions management page in the Twitch Dev Dashboard.

![ENV Var](/docs/images/Lambda-ENV-2.png)


## Step 3: Code
The code for the tutorial can be found in the '/src/twitch-helloworld-query' directory of this project, along with the zip you can upload to Lambda that contains all of the code and required modules for you. Because of the additional work that this function does I've split off the functions dealing with broadcasting to Pubsub into its own 'broadcast.js' file which will be called by the main 'index.js' file.

As mentioned in the opening of this page this is just an example to get started with a serverless EBS, as you can see from the code one potential drawbacks it its current state is that before it sends a response back to the user who sent the request it has to wait for the DynamoDB update and broadcast functions to finish which reduces the responsiveness to around 300ms +/-50ms in my tests (with the smallest Lambda function, this can be reduced by increasing its size). In a real world extension the responsiveness can be dramatically improved by sending a response directly to the user the moment a new colour is created, and doing the database update/broadcast asynchronously but while this is simple to achieve it is beyond the scope of this tutorial and may make it less clear how the EBS functions.

## Step 4: Next
Our final step to putting this EBS together is to use API Gateway to create the routes that will proxy the incoming requests to the appropriate Lambda function [API Gateway Routes](/docs/HelloWorld/API_Gateway.md).