# AWS Lambda@Edge Experiment

## Requirements

* AWS Lambda@Edge (enabled Preview)
* One Amazon CloudFront Distribution (origin doesn't matter)
* IAM role (basic execution is enough)
* npm to install Node.js dependencies


## Lambda Function Details

The Lambda@Edge will be invoked whenever a new "Viewer Request" event is triggered by CloudFront.

The Lambda Function will behave as follows:

1. If the requested resource is NOT available locally (i.e. not an HTML file), the request can proceed to the origin
2. If the local template exists, it will be read and rendered using Plates with a few dynamic variables (i.e. "title" and "today)
3. The resulting HTML is then minified and eventually compressed, based on the request HTTP headers (response headers are correctly set as well)
4. The final HTTP body is directly returned to the client without hitting the CloudFront origin

## How to create the Deployment Package

`cd this-gist`

`npm install`

`zip -r ../edge-deployment-package.zip ./*`

## Known Limitations

* The deployment package cannot exceed 1MB, and a manual hack was required to include the 'html-minifier' library (i.e. reducing its size from 3MB to 500KB)