# Hello World
The Hello World sample extension is a simple extension that uses the EBS for 2 main pieces of functionality. First, when the extension loads it sends a request to the EBS to get the initial colour of a circle, which allows the frontend to start with whatever the current state is. Secondly, the EBS has an endpoint for changing the colour and broadcasting that change out on Twitch's Pubsub so that all users will see that change.

Because this EBS design is stateful, in that it tracks the current colour as a variable, as well as using timers to ignore colour change requests from users who spam requests in a short period of time, we have to make some changes to allow this to work in Lambda which is stateless and doesn't persist variables each time a function is invoked.

To handle these issues we will go in the direction we would if this were a live extension which is to use a database to store our data. This will provide the advantage of allowing the functions to retrieve and store data consistently each time the functions are invoked, unlike the sample EBS which allows the data to persist for only as long as the EBS is running and doesn't persist through restarts/crashes.


## [Creating a DynamodDB Table](/docs/HelloWorld/DynamoDB.md)
There are a number of ways to store persistent data for use with Lambda, including S3, DynamoDB and RDS just to name a few. DynamoDB will work well for this tutorial as it's a lot more affordable than something like a managed relational database service, and the responsiveness and scalability really suits Twitch extensions. As an extension grows and becomes more successful it would be advantageous to use an in-memory store service like Redis, or caching, to further increase responsiveness but that's beyond the scope of this tutorial.


## [Creating an IAM role](/docs/HelloWorld/IAM.md)
All Lambda functions need to be assigned a role that they will be run as, and as we will be using a DynamoDB database we will have to create a role that will have the rights to read and write to the DynamoDB table.


## [Query Colour Function](/docs/HelloWorld/Lambda_Query.md)
The query function will be designed to verify the Authorization header of requests, and then retrieve the data for that channel from DynamoDB and return the colour value to the user. 


## [Cycle Colour Function](/docs/HelloWorld/Lambda_Cycle.md)
The cycle function will verify the Authization header, as all communication between EBS and clients should be verified just like the query function, retrieve channel data from DynamoDB, check that the user hasn't made another request recently to protect against spam, and if all checks have passed so far a new colour will be randomly generated and broadcast on Pubsub to all clients on that channel.


## [API Gateway Routes](/docs/HelloWorld/API_Gateway.md)
API Gateway will provide us the endpoints we need that will proxy the requests from clients on to our Lambda functions. We will also need to update the client of the Hello World extension so that requests are made to the URL provided rather than attempting to send requests to localhost.