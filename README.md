# Geoscriptions

project consisting of a client-side application built with Next.js and a server-side application built with NestJS.

## Directories

The project is organized into the following directories:

- `packages/client`: Contains the client-side application built with Next.js.
- `packages/server`: Contains the server-side application built with NestJS.

## Getting Started

To get started with the development of the project, follow the steps below:

1. Clone the repository.
2. Navigate to the root directory of the project.
3. Run `pnpm install` to install dependencies

### Development

To start the development server for the client-side application, run the following command:

```sh
pnpm dev:client
```

To start the development server for the server-side application, run the following command:

```sh
pnpm dev:server
```

> If you are in the testnet and mainnet branches, all you need to do is start the client

### Building

To build the client-side application, run the following command:

```sh
pnpm build:client
```

To build the server-side application, run the following command:

```sh
pnpm build:server
```

To compile and upload the database using Prisma, run the following command:

```sh
pnpm build:prisma
```

### Production

To start the production server for the server-side application, run the following command:

```sh
pnpm start:prod
```

If you want to upload the client to the production environment, please push it to the testnet and mainnet branches.

> Please note that testnet and mainnet cannot directly upload code, they can only merge the main branch
