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

## Problem

In today's digital world, securely handling important documents—whether legal contracts, business agreements, or personal paperwork—often involves complex workflows and trust concerns. The need for multiple parties to sign a document can become cumbersome and inefficient, leading to delays, confusion, and a lack of transparency in the process. Some key problems include:

- Trust Issues: Document signing processes usually require trusting a centralized authority or third party to validate signatures, which may introduce the risk of tampering or mismanagement.

- Lack of Transparency: In traditional document management systems, tracking who has signed a document and when can be difficult, especially when multiple signers are involved. Ensuring that every signer has signed the document is often a manual and error-prone task.

- Inefficiency and Delays: The traditional document signing process is often slow, requiring manual intervention or several back-and-forth interactions between parties to ensure completion. This creates friction, particularly in scenarios requiring multiple signers or multiple documents.

- Security Concerns: Protecting the integrity of the document and the privacy of the signers’ information is paramount. Centralized systems may be vulnerable to data breaches, unauthorized access, or tampering, which could compromise sensitive information.

## Solution

- Decentralized Trust:

By using the Ethereum blockchain, the Signele contract eliminates the need for a centralized authority to manage document signatures. The contract itself handles document creation, signing, and validation, ensuring that no single entity can tamper with or alter the signing process. All actions (such as signing and document completion) are immutable and publicly verifiable on-chain.
- Full Transparency:

The contract provides a clear audit trail for every document. Each document has an associated list of signers, and the contract tracks when each signer completes their signature. This information is stored on-chain and can be easily retrieved, ensuring transparency throughout the entire document lifecycle.
The getDocument function allows anyone to view document details, including who the signers are, who has signed, and whether the document has been completed.
- Efficiency in Signing:

The contract streamlines the process of document signing by allowing multiple signers to sign a document without the need for intermediary interactions. As soon as all authorized signers complete their signatures, the document is automatically marked as completed by the smart contract, reducing delays and the need for manual verification.
The signDocument function enables each signer to sign the document directly on the blockchain, eliminating unnecessary communication and ensuring all actions are executed in real-time.

- Enhanced Security:

The contract ensures that document and signature data is securely stored via cryptographic hashes (e.g., IPFS hash for the document, signature hashes for signers). These hashes guarantee that the document and signatures cannot be altered once they are submitted.
Sensitive data, like the signatures, are hashed, and the full document contents are stored off-chain (using the fileHash), further protecting the document from unauthorized access. Additionally, the ReentrancyGuard and Pausable features enhance the contract's security by preventing malicious interactions and allowing the contract to be paused in case of an emergency.

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
- contract address: 0x336172f27e937e4810D1b4611D0d98E885f87095
- contract explorer: https://sepolia.scrollscan.com/address/0x336172f27e937e4810D1b4611D0d98E885f87095
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