# Signele: Decentralized Document Signing Platform

![Signele Logo](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrIqjellmZfEmjcAOiI-r5WxERqj4wanQgxw&s)

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Smart Contract Overview](#smart-contract-overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Smart Contract Functions](#smart-contract-functions)
- [Events](#events)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Signele is a decentralized document signing platform built on the Scroll blockchain. It allows users to create, sign, and track documents securely and transparently. By leveraging blockchain technology, Signele ensures the integrity and immutability of signed documents while providing a user-friendly interface for managing the signing process.

## Features

- Create and upload documents for signing
- Invite multiple signers for each document
- Secure document signing with cryptographic signatures
- Real-time tracking of document status and signatures
- Immutable record of all document transactions
- User-friendly interface for managing documents and signatures

## Smart Contract Overview

The Signele smart contract is built using Solidity and implements the following key components:

- Upgradeable pattern for future improvements
- Access control with ownership
- Pausable functionality for emergency situations
- Reentrancy protection
- Efficient storage and retrieval of document and signature data

## Getting Started
- contract address: 0xa0879067960139FdE612A35E9Ba4a18c34c28C73
- contract explorer: https://sepolia.scrollscan.com/address/0xa0879067960139FdE612A35E9Ba4a18c34c28C73
### Prerequisites

- Node.js (v18.0.0 or later)
- npm (v6.0.0 or later)
- Hardhat Suite
- Alchemy SDK

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/dayo-adewuyi/signele.git
   cd signele
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Compile the smart contract:
   ```
   npx hardhat compile
   ```

4. Deploy the smart contract to your chosen network:
   ```
   npx hardhat run deploy --network scroll
   ```

5. Start the frontend application:
   ```
   npm start
   ```

## Usage

1. Connect your  wallet to the application.
2. To create a document:
   - Click on "Create Document"
   - Enter the document title and upload the file
   - Add the Ethereum addresses of the signers
   - Click "Submit" to create the document on the blockchain
3. To sign a document:
   - Navigate to the "Documents to Sign" section
   - Select the document you want to sign
   - Review the document details
   - Click "Sign" and confirm the transaction in your wallet
4. Track the status of your documents in the "My Documents" section.

## Smart Contract Functions

### `createDocument(string memory _title, string memory _fileHash, address[] memory _signers)`
Creates a new document to be signed.

### `signDocument(uint256 _documentId, string memory _signatureHash)`
Allows an authorized signer to sign a document.

### `getDocument(uint256 _documentId)`
Retrieves the details of a specific document.

### `getDocumentSignatures(uint256 _documentId)`
Retrieves all signatures for a specific document.

### `getUserCreatedDocuments(address _user)`
Retrieves all documents created by a specific user.

### `getUserSignedDocuments(address _user)`
Retrieves all documents signed by a specific user.

## Events

- `DocumentCreated`: Emitted when a new document is created.
- `DocumentSigned`: Emitted when a document is signed.
- `DocumentCompleted`: Emitted when all required signatures for a document are collected.

## Security Considerations

- The contract uses OpenZeppelin's upgradeable contracts for future improvements.
- Implements `ReentrancyGuard` to prevent reentrancy attacks.
- Uses `Pausable` functionality for emergency stops.
- Ensures only authorized signers can sign documents.
- Prevents double-signing of documents.

## Contributing

We welcome contributions to Signele! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

Please make sure to update tests as appropriate and adhere to the code style guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.