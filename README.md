# Geoscriptions

project consisting of a client-side application built with Next.js and a server-side application built with NestJS.

## Directories

The project use monorepo for multiple packages is organized into the following directories:

- `packages/inscription-contracts`:  Contains the contracts built with hardhat.
- `packages/inscription-frontend`: Contains the client-side application built with Next.js.
- `packages/inscription-service`:  Contains the server-side application built with NestJS.

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

If the server API is changed, it can be run in the client directory to generate client API code

```sh
cd packages/client
pnpm genapi
```

> If you are in the testnet and mainnet branches, all you need to do is start the client

> do not push code on the testnet and mainnet branches, as this can lead to confusion

> The best practice is to develop through the main branch, where testnet/mainnet merge the main branch

### Production

If you want to upload the client to the production environment, please push it to the testnet and mainnet branches.

```sh
git checkout testnet
git merge main
git push
# or
git checkout mainnet
git merge main
git push
```

To restart the production server for the server-side application, run the following command in remote server:

```sh
cd /mxc/depinscriptions-wannsee
git pull
pm2 restart depinscriptions-wannsee
# or
cd /mxc/depinscriptions-mainnet
git pull
pm2 restart depinscriptions-mainnet
```

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
