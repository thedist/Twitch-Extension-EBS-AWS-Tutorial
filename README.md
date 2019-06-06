# Twitch-Extension-EBS-Tutorial
Tutorial for using AWS API Gateway and Lambda as a severless EBS for Twitch's [Hello World](https://github.com/twitchdev/extensions-hello-world) and [Animal Facts](https://github.com/twitchdev/animal-facts) sample extensions.


## About
Not all extensions need an EBS, especially now that Twitch offer a configuration service to handle extension configuration, but for extensions that do require an EBS it can be a noticible cost to run and maintain a server. While a VPS or dedicated servers do have their uses, a large number of extensions on Twitch can benefit from a serverless setup which will only incur charges when used, rather than constantly cost money even when idle such as when no stream is currently live with your extension. These services can also easily scale with the useage of the extension to be account for spikes in demand and periods of low activity.

This tutorial aims to show how AWS can be used to as an EBS for the Twitch extension tutorials, and also point out some of the added complexities due to Lambda being stateless compared to the EBS servers provided in the sample extensions themselves. This is not intended as a complete guide to the services used in this tutorial, as different extensions will have different needs and to cover the services in depth would be beyond the scope of this tutorial, instead I hope this tutorial will provide a starting point for using a serverless infrastructure as an cost effective EBS.

For this tutorial I'll be using Amazon Web Services (AWS) for the backend:
* DynamoDB - Database to store extension state for each channel.
* IAM - Access rights management between services.
* Lambda - Run Node.js/Go functions to act as a backend for the extensions.
* API Gateway - Web accessible endpoint for the extension's frontend to send requests to.


## Getting Started
This guide assumes you already have an AWS account, if not please sign up at https://aws.amazon.com/


## Documentation
1. [**Hello World**](/docs/HelloWorld/Intro.md)
   1. [**Creating a DynamodDB Table**](/docs/HelloWorld/DynamoDB.md)
   1. [**Creating an IAM role**](/docs/HelloWorld/IAM.md)
   1. [**Query Colour Function**](/docs/HelloWorld/Lambda_Query.md)
   1. [**Cycle Colour Function**](/docs/HelloWorld/Lambda_Cycle.md)
   1. [**API Gateway Routes**](/docs/HelloWorld/API_Gateway.md)

1. [**Animal Facts**](/docs/AnimalFacts/Intro.md)
   1. [**Random Fact Function**](/docs/AnimalFacts/Lambda_RandomFact.md)
   1. [**API Gateway Routes**](/docs/AnimalFacts/API_Gateway.md)

1. [**What's Next?**](/docs/Whats_Next.md)


## Author
* **Jeff Martin** - Twitch: [theDist](https://twitch.tv/thedist) Twitter: [@theDist](https://twitter.com/thedist)

If you need to get in touch either message me here on GitHub, on Twtich's [Dev forums](https://discuss.dev.twitch.tv), or on the TwitchDev server in the Twitch app. If you liked this tutorial I'd appreciate anyone who wants to follow me on Twitch using my channel link above. I plan to write more tutorials on different subjects as I try new things, some of which I plan to stream in the future too!


## Special Thanks
Special thanks go to the original developers and contriutors of the [Hello World](https://github.com/twitchdev/extensions-hello-world) and [Animal Facts](https://github.com/twitchdev/animal-facts) sample extensions from which the EBS code in this tutorial is a derivitive work of.

## License

This project is licensed under the Apache 2.0 - see the LICENSE file for details