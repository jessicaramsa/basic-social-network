# Sherpa Brokers Back Challenge

Backend Technical Test for applying for a developer position at Sherpa Brokers.

## Context and scope
This is a backend technical test that presents a basic social network, there will be two types of users, both of them can retrieve posts information with differences in their permissions.

There are small differences in the permissions for both types of users. The users can be administrators or normal users.

## Goals
- All users need to be authenticated in the platform.
- Administrators can create, update, and delete posts.
- Administrators can create, update, and delete others administrators, and normal users.
- Normal users can only retrieve posts.
- Normal users can retrieve other users' information.
- Every post need to keep a track of the number of times is queried by any user.

## Overview

This is a basic social network where the administrator publishes a post and all the users can view them. All the users can see other users' information as a way to know the original author of the post.

## Design

This is a backend application that used Javascript as the primary programming language, Node.js as the runtime, and Adonis.js as the framework that provides the project structure and configuration to make the connection to the database.

The application retrieves all the information from a relational database with MySQL and is provided by Planetscale which is located in the cloud. This gives the opportunity to connect the application to the database from anywhere and offers the security to connect with specific users and their respective passwords.

- Javascript
- [Node.js v16.14.2](https://nodejs.org/en/)
- Framework [Adonis.js v4.1](https://legacy.adonisjs.com/docs/4.1/installation)
- The database is provided by [Planetscale](https://planetscale.com/)
- Deployed to [Netlify](https://www.netlify.com/)

![Database design for current solution](https://github.com/jessicaramsa/sherpabrokers-back-challenge/blob/develop/resources/imgs/solution.png?raw=true)

## Instructions

### Installation

Clone the repository via HTTPS

```bash
git clone https://github.com/jessicaramsa/sherpabrokers-back-challenge.git
```

Install [Adonis.js v4.1](https://legacy.adonisjs.com/docs/4.1/installation#_installing_adonisjs) globally via npm

```bash
npm i -g @adonisjs/cli
```

Install the dependencies

```bash
npm i install
```

### Setup

Copy the `.env.example` file and rename it as `.env`

Copy all the private keys and sensitive information to setup the project

### Migrations

Run the following command to run startup migrations

```bash
adonis migration:run
```

### Run the project

Finally, run the project

Via Adonis command tool

```bash
adonis serve --dev
```

Via npm

```bash
npm run dev
```

### Documentation

Check out the documentation generated at [localhost](http://127.0.0.1:3333/docs).

To authorize the web services:

1. Try out the `/login` web service

2. Copy the value of the `authToken` parameter

3. Click on the `Authorize 🔒` button on the up to the right

![Authorize button](https://github.com/jessicaramsa/sherpabrokers-back-challenge/blob/develop/resources/imgs/docs1.png?raw=true)

4. On the value field, enter the word `Bearer` and the value of the authorization token you copied in the second step 

![Authorization token](https://github.com/jessicaramsa/sherpabrokers-back-challenge/blob/develop/resources/imgs/docs2.png?raw=true)

5. Click on the button `Authorize` and then click `Done`

![API documentation](https://github.com/jessicaramsa/sherpabrokers-back-challenge/blob/develop/resources/imgs/docs3.png?raw=true)

## Scalability

The current solution is a simple way to start generating information with the posts and maybe in the future give a more scalable solution where all the users can follow topics, and other users.

In a social network, one of the most important features is the reactions and metrics we can analyze from just a single post. With this information, we can know more about our audience and publish related content on which topics are more popular.

The current design limits to only creating posts with text but we can expand the solution with the upload process of multimedia files, in the long term we can add more allowed formats, and the users will be freer to upload any kind of content.

The following diagram represents the database design with the previous features that will be added.

![Database design for a scalable solution](https://github.com/jessicaramsa/sherpabrokers-back-challenge/blob/develop/resources/imgs/scalability1.png?raw=true)

Additionally, a second database will be created to store all the information related to analytical as metrics about the posts, reactions, and users' activity.

This database will be very important for all the metrics and reports that can be created starting from users' activity.

![Database design for a scalable solution with metrics](https://github.com/jessicaramsa/sherpabrokers-back-challenge/blob/develop/resources/imgs/scalability2.png?raw=true)
