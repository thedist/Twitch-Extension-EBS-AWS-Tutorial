# What's Next


## Lambda Aliases and API Stages
When you're in an environment where you need to make updates and changes to one of your services, but can't afford to have the system go offline or break while you're making this changes, then a great way to go about doing this is to use Lambda Aliases and API Stages.

By default, a Lambda function that is run by the API Gateway will be whatever is the latest version, which has some risks to it if you're testing out some new things that might break functionality. To deal with this we can create 2 (or more) Aliases, 'DEV', and 'PROD', for development and production versions. This way you can set the DEV alias to always point to whatever is the latest version that you're currently working on, while the PROD alias will be set to a specific version of the function that you know is good.

In the API Gateway, when we choose what Lambda function a particular method calls, we can add a version to the end of the function name, but rather than setting DEV or PROD, we can just specify `:${stageVariables.lambdaAlias}`, and then whatever we set as the 'lambdaAlias' value in the stage variables setting is what will be called. So when the DEV stage URL is used it can call the DEV lambda function, and whenever the PROD API URL is called it'll start the PROD Lambda function.

Using this setup means that we can run multiple versions side by side without needing to duplicate API Gateway or Lambda functions, the different Stage URLS just access different functions!


## API Gateway Custom Domain
It's possible to use your own domain name with API Gateway, it's as simple as going through a little config and adding a CNAME DNS record on your domain that points to your API. Then rather than a long amazon URL you can point a 'webhooks' subdomain to the API and use `webhooks.yourdomain.com`, and through path mapping you can point different API's to different paths, such as `webhooks.yourdomain.com/dev` and `webhooks.yourdomain.com/prod` or point to an entirely separate API that you've set up.


## API Gateway Tweaks
There are far too many config options and ways to go about utilising API Gateway to go into detail here, but one nice feature is validating request querystring/headers/body. One example of how this might be used would be on the GET method we set up in this tutorial, where the only use it has is for handling the 'hub.challenge', so if an incoming request lacks that header it would be beneficial to just have API Gateway immediately respond that a header is missing and skip ever having to run the Lambda function. By validating expected requests we can ensure that Lambda time isn't needlessly wasted which will help save costs and reduce needless load on any services that your function might make use of.


## Lambda Optimization
Lambda functions are charged for the duration they run, in 100ms increments, which means it's beneficial to reduce the execution time of a function to reduce costs.

One way that can potentially reduce the execution time is to increase the memory that the Lambda function is allocated, the reason for this is that while most functions can operate well within the minimum 128MB RAM the CPU is also allocated in proportion to this (and less well documented is that so to is the bandwidth to your Lambda function). This means that while it is proportionally more expensive per 100ms to increase the assigned memory it is possible for the execution time to be reduced more than the increase in cost. A function that is either bandwidth or compute intensive can often see overall cost reductions (as well as responsiveness to the end user) by increasing memory, where as functions that rely on external services (such as API requests to Twitch) may not see as much benefit as the round trip time for API requests, and the processing done on the external services end, will largely be unchanged by increased resources. The only way to know what works best for your function is to run your own tests.


## Downsides
As with all solutions, there are both pros and cons. I'm still exploring various AWS services and trying new things myself so I'm not able to give in depth advice on everything, but one issue I've encountered is the way in which DynamoDB works. It's great as a simple store of a few fields, and supports a variety of field types, but coming from a MongoDB background I feel that the limitations on indexes/primary keys, as well as depth of queries and aggregation just isn't there for DynamoDB. Maybe there are ways to get more out of it that I haven't explored yet, or maybe DynamoDB simply has it's own use cases and outside of that you're expected to use Amazons more expensive database services.
