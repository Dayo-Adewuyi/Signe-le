// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Signele Contract
/// @notice This contract allows for document creation, signing, and tracking.
/// @dev This contract uses pausable functionality.
contract Signele is  Pausable, ReentrancyGuard {

    struct Document {
        string title;
        string description;
        string fileHash;  
        address[] signers;
        address creator;
        bool completed;
    }

    struct Signature {
        address signer;
        string signatureHash;
        uint256 timestamp;
    }

    mapping(uint256 => Document) private documents;
    mapping(uint256 => Signature[]) private documentSignatures;
    uint256 private documentCount;
    address private owner;
    mapping(address => uint256[]) private userCreatedDocuments;
    mapping(address => uint256[]) private userSignedDocuments;

    /// @notice Emitted when a document is created.
    /// @param documentId The ID of the created document.
    /// @param title The title of the document.
    /// @param signers The list of signers for the document.
    /// @param creator The address of the document creator.
    event DocumentCreated(
        uint256 indexed documentId,
        string title,
        address[] signers,
        address creator
    );

    /// @notice Emitted when a document is signed.
    /// @param documentId The ID of the document being signed.
    /// @param signer The address of the signer.
    /// @param signatureHash The hash of the signer's signature data.
    event DocumentSigned(
        uint256 indexed documentId,
        address signer,
        string signatureHash
    );

    /// @notice Emitted when a document is fully signed and completed.
    /// @param documentId The ID of the completed document.
    event DocumentCompleted(uint256 indexed documentId);


    constructor() {

        documentCount = 0;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    /// @notice Creates a new document to be signed by the specified signers.
    /// @param _title The title of the document.
    /// @param _fileHash The hash of the document file (e.g., IPFS hash).
    /// @param _signers The list of addresses authorized to sign the document.
    function createDocument(
        string memory _title,
        string memory _description,
        string memory _fileHash,
        address[] memory _signers
    ) external whenNotPaused {
        require(_signers.length != 0, "At least one signer is required");

        uint256 documentId = documentCount++;
        Document storage newDoc = documents[documentId];
        newDoc.title = _title;
        newDoc.fileHash = _fileHash;
        newDoc.signers = _signers;
        newDoc.description = _description;
        newDoc.creator = msg.sender;
        newDoc.completed = false;

        userCreatedDocuments[msg.sender].push(documentId);

        emit DocumentCreated(documentId, _title, _signers, msg.sender);
    }

    /// @notice Allows a signer to sign a document.
    /// @param _documentId The ID of the document being signed.
    /// @param _signatureHash The hash of the signer's signature data.
    function signDocument(
        uint256 _documentId,
        string memory _signatureHash
    ) external whenNotPaused nonReentrant {
        Document storage doc = documents[_documentId];
        require(!doc.completed, "Document already completed");
        require(isAuthorizedSigner(msg.sender, doc.signers), "Not authorized to sign");
        require(!hasSignerSigned(_documentId, msg.sender), "Already signed");

        Signature memory newSignature = Signature({
            signer: msg.sender,
            signatureHash: _signatureHash,
            timestamp: block.timestamp
        });

        documentSignatures[_documentId].push(newSignature);
        userSignedDocuments[msg.sender].push(_documentId);

        emit DocumentSigned(_documentId, msg.sender, _signatureHash);

        if (allSigned(_documentId)) {
            doc.completed = true;
            emit DocumentCompleted(_documentId);
        }
    }

    /// @notice Returns details of a specific document.
    /// @param _documentId The ID of the document.
    /// @return title The title of the document.
    /// @return description The description of the document.
    /// @return fileHash The hash of the document file.
    /// @return signers The list of document signers.
    /// @return creator The address of the document creator.
    /// @return completed Whether the document is fully signed and completed.
    function getDocument(uint256 _documentId)
        external
        view
        returns (
            string memory title,
            string memory description,
            string memory fileHash,
            address[] memory signers,
            address creator,
            bool completed
        )
    {
        Document storage doc = documents[_documentId];
        return (doc.title, doc.description, doc.fileHash, doc.signers, doc.creator, doc.completed);
    }

    /// @notice Returns the signatures for a specific document.
    /// @param _documentId The ID of the document.
    /// @return An array of signatures for the document.
    function getDocumentSignatures(uint256 _documentId)
        external
        view
        returns (Signature[] memory)
    {
        return documentSignatures[_documentId];
    }

    /// @notice Returns the list of document IDs created by a specific user.
    /// @param _user The address of the user.
    /// @return An array of document IDs created by the user.
    function getUserCreatedDocuments(address _user)
        external
        view
        returns (uint256[] memory)
    {
       
       
        return userCreatedDocuments[_user];
    }

    /// @notice Returns the list of document IDs signed by a specific user.
    /// @param _user The address of the user.
    /// @return An array of document IDs signed by the user.
    function getUserSignedDocuments(address _user)
        external
        view
        returns (uint256[] memory)
    {
        
        return userSignedDocuments[_user];
    }

    /// @dev Checks if a signer is authorized for a document.
    /// @param _signer The address of the signer to check.
    /// @param _signers The list of authorized signers.
    /// @return Boolean indicating whether the signer is authorized.
    function isAuthorizedSigner(address _signer, address[] memory _signers)
        internal
        pure
        returns (bool)
    {
        uint256 length = _signers.length;
        for (uint256 i = 0; i < length; i++) {
            if (_signers[i] == _signer) {
                return true;
            }
        }
        return false;
    }

    /// @notice Checks if a specific signer has signed a document.
    /// @param _documentId The ID of the document.
    /// @param _signer The address of the signer.
    /// @return Boolean indicating whether the signer has signed.
    function hasSignerSigned(uint256 _documentId, address _signer)
        public
        view
        returns (bool)
    {
        Signature[] storage signatures = documentSignatures[_documentId];
        uint256 length = signatures.length;
        for (uint256 i = 0; i < length; i++) {
            if (signatures[i].signer == _signer) {
                return true;
            }
        }
        return false;
    }

    /// @dev Checks if all authorized signers have signed the document.
    /// @param _documentId The ID of the document.
    /// @return Boolean indicating whether all signers have signed.
    function allSigned(uint256 _documentId)
        internal
        view
        returns (bool)
    {
        Document storage doc = documents[_documentId];
        uint256 length = doc.signers.length;
        for (uint256 i = 0; i < length; i++) {
            if (!hasSignerSigned(_documentId, doc.signers[i])) {
                return false;
            }
        }
        return true;
    }

    /// @notice Pauses contract actions.
    /// @dev Only callable by the contract owner.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses contract actions.
    /// @dev Only callable by the contract owner.
    function unpause() external onlyOwner {
        _unpause();
    }
}