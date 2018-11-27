# Query Colour Function
This Lambda function has 3 main steps. First it verifies the JWT token sent by the extension, then it retrieves the channel data from DynamoDB or creates it if it doesn't yet exist, and then finally return the current colour to the user.


## Step 1: Creating a Lambda Function
Navigate to the [Lambda](https://console.aws.amazon.com/lambda/home) dashboard and from here just click the **Create Function** button. We will be authoring an app from scratch so leave that selected, for the name we'll call this one 'Twitch-HelloWorld-Query', change the runtime to Node.js 8.10 and as we've already created an IAM role for this we can choose the existing role 'twitch-ext-helloworld'.


## Step 2: Setting environment variables
To verify JWT tokens we will need to set an env variable called 'secret', so before we start coding scroll down to the environment variables section and enter your client secret that can be found on your Extensions management page in the Twitch Dev Dashboard.

![ENV Var](/docs/images/Lambda-ENV-1.png)


## Step 3: Code
For functions that don't require modules, or for when you're making changes to a Lambda function that already contains required modules, the Lambda code editor is sufficient, but the easiest way to develop Lambda functions is to develop them locally and using NPM to download any modules you may need and then simply zip the files and use Lambda's ability to upload a zip file. The `aws-sdk` module is natively part of Lambda so does not need to be included in the `node_modules` folder with the other required modules.

The code for the tutorial can be found in the '/src/twitch-helloworld-query' directory of this project, along with the zip you can upload to Lambda that contains all of the code and required modules for you.

You can see from the code, there are 4 basic steps in this Lambda function.
1. Verify the JWT (which if fails causes the Lambda function to end and respond with an error response)
1. Get channel data from our DynamoDB table or create an item if it doesn't yet exist.
1. return a '200' status code and the colour for the channel.


## Step 4: Next
Next is to create the cycle colour function which will handle updating the database for colour cycle requests and also broadcast the change on Pubsub so that all users currently viewing the extension get the latest colour [Cycle Colour Function](/docs/HelloWorld/Lambda_Cycle.md).