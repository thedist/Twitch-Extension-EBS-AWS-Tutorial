# API Gateway
API Gateway is a service that will be our Internet facing part of this tutorial, it provides the routes that the extension will use to send GET and POST requests to which will then be passed on to our Lambda functions. This is one of the services that we'll be using that has only a limited 12 month trial of 1 million free request, after which it will cost $3.50 per million requests at the time of writing this, plus data transfer costs, but both of these will be almost negligible at the scale that this tutorial is for.


## Step 1: Create our API
From the API Gateway dashboard, click Create API. The creation settings should be self-explanatory, the only one worth mentioning is endpoint type, and this is set to edge optimised because our API will act as a gateway between internal services, such as Lambda, and the internet. If you was creating an API to use between services within the same AWS Region, then Regional API Endpoint would be used, and Private API Endpoint is for AWS VPC, neither of which we will deal with in this tutorial.

![Create API](/docs/images/API-Gateway-1.png)


## Step 2: Query Endpoint
The query request from the extension frontend is sent as a GET request to the `/query` path of the EBS, so first we need to be on the resources page for our API Gateway, and then from the actions dropdown menu select 'create resource' and create one called `query`.

![Create Resource](/docs/images/API-Gateway-2.png)

Once the Query resource is created we can click it and through the actions dropdown menu this time we will select 'create method' and from that select 'GET'. From our newly created 'GET' method we will set it up to proxy the request to our 'Twitch-HelloWorld-Query' Lambda function. Depending on your location your Lambda region may differ to that in the example, so select the region used during the creation of the Lambda functions. If you're unsure of your Lambda region you can check by going to your Lambda function and looking at the Amazon Resource Name in the top right which should look something like `arn:aws:lambda:eu-west-1:...`.

![Create Method](/docs/images/API-Gateway-3.png)


## Step 3: Cycle Endpoint
To create the cycle endpoint the process is the same as we just did for the query endpoint, except that the resource will be called 'cycle', the method needs to be 'POST' rather than 'GET', and the Lambda function we will proxy the request to is 'Twitch-HelloWorld-Cycle'.


## Step 4: Deploy
For the API to be reachable, we now have to deploy it by clicking 'Deploy API' in the actions dropdown menu. Since this is the first time time we're deploying our API we will need to create a stage to deploy to. For the tutorial it will be perfectly fine to use a single stage, but in a production environment you will likely want to use separate stages for development and production.

![Deploy Stage](/docs/images/API-Gateway-4.png)


## Step 5: API URL
From the stages section of our API, you can now see an 'Invoke URL', which should look something like `https://someIdHere.execute-api.eu-west-1.amazonaws.com/DEV`. This is now an internet accessible address for our GET and POST lambda functions. As we now how this URL we can edit the extension frontend to call our new URL rather than a locally hosted EBS.

The file we need to edit on our extension frontend is `/public/viewer.js`, and we need to change line 18 from `url: 'https://localhost:8081/color/' + method,` to `url: 'https://someIdHere.execute-api.eu-west-1.amazonaws.com/DEV/' + method,`. This will cause the frontend of our extension to call our API Gateway and run our Lambda functions rather than attempting to send requests to a locally hosted EBS.


## Step 6: Checking it works
With the frontend updated everything should now be in place for our EBS to work for the extension. To test it we can either host the frontend locally (which is possible within the new Dev Rig), or for hosted testing we can zip the contents of the public folder and upload them to Twitch's CDN and move to a hosted testing stage. If for any reason there is an issue and the EBS is unreachable the first place to check is CloudWatch Logs on AWS, which will show a log entry for each time our EBS functions are called as well as display any errors that may be logged to console.