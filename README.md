# Hackathon

## The problem

The user has unstructured data which they want to generate relevant images for.

Our aim is to enable NLP for everyone.

## Architecture

User input > AWS Comprehend > Tags > Photos

## User input

The user can use a text area or import a document

## Day one

Work through AWS Comprehend documentation and tutorials to get understanding of how it works

## Day two

Create basic app to show user interaction with the AWS Comprehend Syntax analysis

Learning how to train a model

Better analysis of tags

More photo services

Process images in AWS recognition to filter images - what is an image, different skin colours, genders

## Improvements

Text - exams, articles

how do you get picture for an organisation?
how do provide relevant results?


## Deployment

Required Env variables

AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
UNSPLASH_ACCESS_KEY_ID

Create docker container and deploy it to AWS ECS

building the container:
`yarn docker-build`

running the container locally:
`yarn docker-run-local`