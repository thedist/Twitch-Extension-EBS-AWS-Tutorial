# API Gateway
API Gateway is a service that will be our Internet facing part of this tutorial, it provides the routes that the extension will use to send POST requests to which will then be passed on to our Lambda functions.

## Step 1: Create our API
From the API Gateway dashboard, click Create API. The creation settings should be self-explanatory with the exception of endpoint type which we will set to edge optimised as our API will act as a gateway between internal services, such as Lambda, and the internet.

![Create API](/docs/images/API-Gateway-5.png)


## Step 2: RandomFact Endpoint
The EBS only needs to handle a single POST request, so we could just create a method for that at the root path, but for future growth it is a good idea to use multiple paths so we will first start by creating a resource called `randomfact` by using the actions dropdown menu from the resources page of our API and selecting 'create resource'.

![Create Resource](/docs/images/API-Gateway-6.png)

Once the Query resource is created we can click it and through the actions dropdown menu this time we will select 'create method' and from that select 'POST'. From our newly created 'POST' method we will set it up to proxy the request to our 'Twitch-AnimalFacts-RandomFact' Lambda function. Depending on your location your Lambda region may differ to that in the example, so select the region used during the creation of the Lambda functions. If you're unsure of your Lambda region you can check by going to your Lambda function and looking at the Amazon Resource Name in the top right which should look something like `arn:aws:lambda:eu-west-1:...`.

![Create Method](/docs/images/API-Gateway-7.png)


## Step 3: Deploy
For the API to be reachable, we now have to deploy it by clicking 'Deploy API' in the actions dropdown menu. Since this is the first time time we're deploying our API we will need to create a stage to deploy to. For the tutorial it will be perfectly fine to use a single stage, but in a production environment you will likely want to use separate stages for development and production.

![Deploy Stage](/docs/images/API-Gateway-4.png)


## Step 4: API URL
From the stages section of our API, you can now see an 'Invoke URL', which should look something like `https://someIdHere.execute-api.eu-west-1.amazonaws.com/DEV`. This is now an internet accessible address to send requests that trigger our Lambda function. As we now how this URL we can edit the extension frontend to call our new URL rather than a locally hosted EBS.

The file we need to edit on our extension frontend is `/src/components/Authentication/Authentication.js`, specifically the `makeCall` function starting on line 79 where we need to adjust it to make a POST request instead of a GET, and to accept a 'body' argument that will we send in the request so that the EBS doesn't need to request the animal type from Twitch and have the potential issues that were mentioned in the Lambda function.

```javascript
makeCall(url, body, method = "POST") {
  return new Promise((resolve, reject) => {
    if (this.isAuthenticated()) {
      let headers = {
        'Authorization': `Bearer ${this.state.token}`
      }

      fetch(url, { method, headers, body })
        .then(res => {
          return resolve(res)
        })
        .catch(e => {
          console.log('response e', e);
          return reject(e)
        })
    } else {
      reject('Unauthorized')
    }
  })
}
```

The second file we need to change is `/src/components/ConfigPage/ConfigPage.js` line 71, where we replace the URL for the locally hosted EBS and replace it with the URL of our API Gateway endpoint (make sure you use your own URL provided by the API gateway, the URL in this example will not work), and also include the checked value (which is the animal type also being used in the Twitch request to set the configuration) which will be used as the request body.

```javascript
this.Authentication.makeCall('https://someIdHere.execute-api.eu-west-1.amazonaws.com/DEV/randomfact', this.state.checked)
```

## Step 5: Checking it works
With the frontend updated everything should now be in place for our EBS to work for the extension. To test it we can either host the frontend locally (which is possible within the new Dev Rig), or for hosted testing we can use `npm run build` from the extensions root directory and zip the contents of the 'dist' folder and upload them to Twitch's CDN which will move to a hosted testing stage (although I don't recommend going through this for the Tutorial). If for any reason there is an issue and the EBS is unreachable the first place to check is CloudWatch Logs on AWS, which will show a log entry for each time our EBS functions are called as well as display any errors that may be logged to console.