doc = """
** Integrating FFmpeg into AWS Lambda: A TypeScript Guide **
FFmpeg is a powerful software library and command-line tool used for handling multimedia files. Whether you need to record, convert, or stream audio and video in various formats, FFmpeg is your Swiss army knife for multimedia processing. In this article, we'll walk you through integrating FFmpeg into your AWS Lambda functions using TypeScript. But first, let's dive into what FFmpeg is and its key use cases.
FFmpeg is a software library and command-line tool used for handling multimedia files. It can be used to record, convert, and stream audio and video in various formats. It is a popular tool used in video production and streaming services. Some of its features include the ability to crop, scale, and filter video, as well as extract audio from video files.
In this article I will be showing you how you can use FFmpeg in your AWS Lambda. Specifically, I will guide you through the process of creating a layer for FFmpeg so that you can use the FFmpeg binary in your Lambda functions.

** AWS Lambda **
Lambda is a serverless computing service offered by AWS. It allows you to run code without provisioning or managing servers. This gives us a great environment to run our FFmpeg operations in. Why?
Lambdas are serverless, this means that we only pay when our lambdas are actually running. You aren’t paying to have a server running all day and night. The other great reason to use lambdas is the fact that you don’t need to worry about a server at all. AWS manages all server-related configurations in the background and all you have to do is focus on the code you are writing.
Lambdas allow us to run code on a server, without us ever having to think about maintaining or managing a server. The pay-per-use model also means it is a cost efficient way to run your code.

** Understanding FFmpeg **
FFmpeg is a versatile multimedia framework with a wide range of capabilities. It can be used to convert media, edit and enhance videos as well as edit and extract audio from videos.
Converting Media: FFmpeg excels at converting media files from one format to another. This capability is invaluable when you need to make your media files compatible with different devices, platforms, or applications.
Editing and Enhancing: FFmpeg offers a comprehensive suite of tools to edit and enhance multimedia content. You can apply various transformations to video and audio. You can crop and resize videos, re-orientate videos by flipping or rotating and apply filters to enhance video and audio quality. You can also use FFmpeg to superimpose images or text as watermarks.
Extracting and Editing Audio: FFmpeg allows you to extract audio from videos, isolate audio from video files for dubbing or voiceover work. Separated audio can be processed further for tasks such as transcription, speech recognition, or audio analysis. These are all useful features when working on video production and podcasts for example.

** What are binaries and why are we using them? **
An executable binary is a file containing machine code that can be directly executed. In the context of FFmpeg, this binary is the result of compiling the FFmpeg source code. Why do we need it? FFmpeg is a command-line tool primarily written in C. Using the FFmpeg binary allows us to run FFmpeg commands without the hassle of compiling the source code within the Lambda environment.
Moreover, precompiled binaries ensure compatibility with the Lambda runtime. In this guide, we'll focus on using the ARM64 architecture for cost-efficiency in Lambda when compared to X86. However, AWS Lambda also supports other architectures, so you can choose the one that suits your needs during Lambda creation.

** Getting the binary ready to use **
Now that we understand why we need the FFmpeg binary, let's prepare it for Lambda. We'll create a Lambda Layer from this binary, and AWS will automatically place it in the /opt folder in the Lambda environment. Keep this folder location in mind when referencing the binary file's path. Here's how to get the binary ready; either by compiling the binary yourself, or downloading a pre-built one.

Compiling the binary yourself:
  - Clone the FFmpeg repo
    - git clone <https://github.com/FFmpeg/FFmpeg.git>
    - cd FFmpeg

  - Inside the FFmpeg source directory, you need to configure your build with the configure script. This gives the ability to customize your FFmpeg build with various options. Have a look at the  FFmpeg docs) for the options that are available.
    - ./configure
  
  - Now we can run the make command to compile ffmpeg. This will create our executable binary, called ffmpeg, that we can use in our lambda.
    - make
Downloading the binary from a link:
  - Download the FFmpeg binary from ffBinaries. Make sure that you match the architecture of the download to the architecture that your Lambda is running on.
  - Once you have this binary downloaded,
    - unzip it.
    - Create a folder called bin and place the FFmpeg binary inside.
    - Now re-zip the bin folder with the binary inside.

** Lambda Layers **
[LINK TO AWS LAMBDA LAYER]
Lambda Layers are a way to manage and distribute your code and its dependencies in AWS Lambda functions. Layers are packages of libraries, custom runtimes, or other function dependencies. By using Lambda Layers, you can separate your code from the unchanging resources, making it easier to manage and update your Lambda functions.

** Let's get coding! **
The code we are going to be writing will be making use of AWS’s Cloud Development Kit (CDK). CDK is a Infrastructure as Code framework and this allows us to set up our infrastructure in a understandable and reusable way. CDK supports various languages such Python and Typescript. We will be making use of typescript. But any of this code can be easily translated into other languages if you prefer it.
Below is the structure of the code for reference.
├── resources
    ├── functions
			├── handler.ts
      └── utils.ts		
		├── layers
	    └── ffmpeg
					├── config.ts
		      └── ffmpeg.zip

Now that our binary is ready, we can get to actually coding and creating our layer.
  - Create a layers/ffmpeg folder and place the ffmpeg.zip inside this folder.
  - Next we will create a config.ts file inside this folder as well. This is where we will configure our layer.

```tsx
import { Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { join } from 'path';

export const FFmpegLayer = (scope: Construct): LayerVersion => {
	return new LayerVersion(scope, 'ffmpeg-layer', {
		compatibleRuntimes: [Runtime.NODEJS_16_X, Runtime.NODEJS_18_X],
		code: Code.fromAsset(join(__dirname, './ffmpeg.zip')),
		description: 'FFMpeg layer for video processing',
	});
};
```
Here we are defining our layer, providing the ffmpeg.zip as the code, allowing it to use the FFmpeg binary.

** Creating Our Lambda **
In functions/config.ts we create the layer and the lambda.

```tsx
import { Duration } from "aws-cdk-lib";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { FFmpegLayer } from "../layers/ffmpeg/config";

export const FFmpegLambda = (scope: Construct) => {
	// Import FFmpeg Layer
	const ffmpegLayer = FFmpegLayer(scope);
	
	// Create Lambda
	new NodejsFunction(scope, "process-uploaded", {
		functionName: `get-video-thumbnail`,
		entry: __dirname,
		handler: "main",
		runtime: Runtime.NODEJS_18_X,
		architecture: Architecture.ARM_64,
		layers: [ffmpegLayer], // Link layer to lambda
	});
};
```
** Using FFmpeg **
Since FFmpeg is just a binary that we can run, we will use spawnSync to run it in our lambda handler. spawnSync is a method provided by the child_process module in Node.js. It is used to execute external commands or processes synchronously. This means we can run subprocesses during our code execution.
To use spawnSync , we need two parts: the path to the binary, which will be /opt/bin/ffmpeg, and the command we want to run, which we will build up.
Here is an example of using FFmpeg. We have a video and we want to programmatically extract a thumbnail from the video. In the command that we compile below we do a couple of things:
  - -ss 1 - This tells FFmpeg to look for a position in the media file. It will take the closest point to the position if it cannot find the exact position.
  - -i objectPath - This specified the input URL, ie. where to find the video.
  - -vf thumbnail,scale=840:480 - This defines something called a filter-graph, which is something quite often used by FFmpeg. This basically just tells FFmpeg what scale we want our thumbnail to be.
  - -vframes 1 - This determines which frame we want to use for our thumbnail, in this case the first frame.
  - tempThumbnailPath -  The path where we want our thumbnail to be stored so we can access it after the command has run.

```tsx  
// Define ffmpeg params so we can run the binary
const ffmpegParams = [
	"-ss",
	"1",
	"-i",
	objectPath, // the path to the video we are extracting info from
	"-vf",
	"thumbnail,scale=840:480", // This determines the scale of the thumbnail
	"-vframes", // This determines which frame we want to use for our thumbnail
	"1", // The frame number
	tempThumbnailPath, //the path where the thumbnail will be placed once extracted.
];

const ffmpeg = spawnSync(ffmpegPath, ffmpegParams); // Actually running the binary with the above configuration
```

Top Tip: You can run spawnSync with an additional option { stdio: 'inherit' }, which allows you to see all of the ffmpeg logs. These logs are really useful during debugging, but will very quickly bloat your logs in a production system.

```tsx
spawnSync(ffmpegPath, ffmpegParams, { stdio: 'inherit' });
```

** Conclusion **
The combination of FFMpeg and Lambda presents a compelling and innovative solution for image transformations, offering a range of benefits that make it a perfect fit for modern computing needs. The synergy between FFmpeg's powerful multimedia processing capabilities and the serverless architecture of AWS Lambda creates a dynamic duo that is both efficient and cost-effective.
Hopefully this guide has shown you the benefits of these two powerful technologies and helps you integrate them into some interesting video and image processing projects.
Happy coding!

"""