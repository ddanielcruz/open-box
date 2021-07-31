<div align="center">
  <h1>:open_file_folder: open-box</h1>
  <p>Online storage application used to upload and share images developed with Node.js and TypeScript</p>
</div>

## Tech

- [Node.js][nodejs] - Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine
- [TypeScript][typescript] - TypeScript is a superset of JavaScript that compiles to clean JavaScript output
- [Express][express] - Fast, unopinionated, minimalist web framework for Node.js
- [Amazon S3][s3] - Object storage built to store and retrieve any amount of data from anywhere
- [Prisma][prisma] - Next-generation Node.js and TypeScript ORM
- [PostgreSQL][postgres] - The World's Most Advanced Open Source Relational Database

## Getting started

The application supports uploading images to both local storage and **Amazon S3**. By default it'll be storing the images locally for simplicity, but if you want to test it using S3 you'll need to setup an AWS account.

In order to run the project you'll need to have [Node.js][nodejs] and [Yarn][yarn] installed in your machine. The resources are stored on a [Postgres][postgres] database, so you also need an instance configured locally or in the cloud.

```sh
# Clone repository
$ git clone https://github.com/danielccunha/open-box.git
$ cd open-box

# Populate environment variables
$ cp .env.example .env
$ nano .env

# Install dependencies
$ yarn

# Start the project in development mode
$ yarn dev
```

The only required environment variable is the `DATABASE_URL` used to connect to Postgres. If you want to use Amazon S3 you'll also need to populate the `AWS_*` variables and change the `STORAGE_TYPE` to `s3`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[nodejs]: https://nodejs.org/en/
[typescript]: https://github.com/microsoft/TypeScript
[express]: https://expressjs.com/
[s3]: https://aws.amazon.com/s3/
[prisma]: https://www.prisma.io/
[yarn]: https://yarnpkg.com/
[postgres]: https://www.postgresql.org/
