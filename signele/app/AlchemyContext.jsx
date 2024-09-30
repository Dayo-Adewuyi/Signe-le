"use client";
import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState, useContext, createContext } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import contractABI from "./contractABI.js";

const AlchemyContext = createContext();

const CONTRACT_ADDRESS = "0x336172f27e937e4810D1b4611D0d98E885f87095";
const abi = [
  "function createDocument(string memory _title, string memory _description, string memory _fileHash, address[] memory _signers) external",
  "function signDocument(uint256 _documentId, string memory _signatureHash) external",
  "function getDocument(uint256 _documentId) external view returns (string memory title, string memory description, string memory fileHash, address[] memory signers, address creator, bool completed)",
  "function getDocumentSignatures(uint256 _documentId) external view returns (tuple(address signer, string signatureHash, uint256 timestamp)[] memory)",
  "function getUserCreatedDocuments(address _user) external view returns (uint256[] memory)",
  "function getUserSignedDocuments(address _user) external view returns (uint256[] memory)",
  "event DocumentCreated(uint256 indexed documentId, string title, address[] signers, address creator)",
  "event DocumentSigned(uint256 indexed documentId, address signer, string signatureHash)",
  "event DocumentCompleted(uint256 indexed documentId)",
];

const eventSignatures = {
  DocumentCreated:
    "0x7d84a6263ae0d98d3329bd7b46bb4e8d6f98cd35a7adb45c274c1d7d2498d9ed",
  DocumentSigned:
    "0x18cb02f23b47ea2a8ea059dabe750e8b893b53696e736e676d969c163a9a1c8c",
  DocumentCompleted:
    "0x38b6d35f92ab92053f6ef398a888dd47c7d8642ac1f912ad397a7b14dd87c158",
};

function extractNumbers(data) {
  console.log("Raw data:", data); // Log the raw data for debugging

  if (Array.isArray(data) && data.length > 0) {
    return data.map((item) => Number(item.toString()));
  } else if (data && typeof data === "object") {
    const arrayProp = Object.values(data).find((prop) => Array.isArray(prop));
    if (arrayProp) {
      return arrayProp.map((item) => Number(item.toString()));
    }
  }
  console.warn("Unexpected data structure:", data);
  return [];
}

export const AlchemyProvider = ({ children }) => {
  const [alchemy, setAlchemy] = useState(null);
  const [userCreatedDocuments, setUserCreatedDocuments] = useState([]);
  const [userSignedDocuments, setUserSignedDocuments] = useState([]);
  const [documentDetails, setDocumentDetails] = useState({});
  const [documentSignatures, setDocumentSignatures] = useState({});
  const [notifications, setNotifications] = useState([]);
  const { address } = useAccount();
  
  useEffect(() => {
    const alchemyInstance = new Alchemy({
      apiKey: "TkpefVTlzoyLYtvxhPzKZtwdB1ks0ef9",
      network: Network.SCROLL_SEPOLIA,
    });
    console.log(alchemyInstance);
    setAlchemy(alchemyInstance);
  }, []);
  const abiInterface = new ethers.Interface(abi);

  async function fetchSigneleEvents(
    eventType,
    fromBlock = "0x0",
    toBlock = "latest"
  ) {
    try {
      console.log(eventType);
      if (!eventSignatures[eventType]) {
        throw new Error(`Invalid event type: ${eventType}`);
      }

      if (alchemy) {
        // const logs = await alchemy.core.getLogs({
        //   address: CONTRACT_ADDRESS,
        //   topics: [eventSignatures[eventType]],
        //   fromBlock,
        //   toBlock,
        // });

        // const provider = new ethers.AlchemyProvider(
        //   Network.SCROLL_SEPOLIA,
        //   "TkpefVTlzoyLYtvxhPzKZtwdB1ks0ef9"
        // );
        // const notifications = await provider.getLogs({
        //   fromBlock,
        //   toBlock,
        //   address: CONTRACT_ADDRESS,
        //   topics: [eventSignatures[eventType]],
        // });

        console.log("logs", logs, notifications);
        setNotifications(logs);
        return logs;
      }
    } catch (error) {
      console.error(`Error fetching ${eventType} events:`, error);
      throw error;
    }
  }
  const makeCall = async (functionName, params) => {
    const data = abiInterface.encodeFunctionData(functionName, params);
    try {
      const result = await alchemy.core.call({
        to: CONTRACT_ADDRESS,
        data: data,
      });
      console.log("result", result);
      return abiInterface.decodeFunctionResult(functionName, result);
    } catch (error) {
      console.error(`Error calling ${functionName}:`, error);
      throw error;
    }
  };
  const fetchUserDocuments = async () => {
    try {
      const createdDocs = await makeCall("getUserCreatedDocuments", [address]);

      const extractedCreatedDocs = extractNumbers(createdDocs);
      console.log(extractedCreatedDocs);
      setUserCreatedDocuments(extractedCreatedDocs);

      const signedDocs = await makeCall("getUserSignedDocuments", [address]);
      const extractedSignedDocs = extractNumbers(signedDocs);
      console.log(extractedSignedDocs);
      setUserSignedDocuments(extractedSignedDocs);
    } catch (error) {
      console.error("Error fetching user documents:", error);
    }
  };

  const getDocument = async (documentId) => {
    try {
      const result = await makeCall("getDocument", [documentId]);
      setDocumentDetails((prevDetails) => ({
        ...prevDetails,
        [documentId]: {
          title: result[0],
          description: result[1],
          fileHash: result[2],
          signers: result[3],
          creator: result[4],
          completed: result[5],
        },
      }));
    } catch (error) {
      console.error("Error fetching document details:", error);
    }
  };

  const getDocumentSignatures = async (documentId) => {
    try {
      const result = await makeCall("getDocumentSignatures", [documentId]);
      setDocumentSignatures((prevSignatures) => ({
        ...prevSignatures,
        [documentId]: result[0].map((sig) => ({
          signer: sig.signer,
          signatureHash: sig.signatureHash,
          timestamp: new Date(sig.timestamp.toNumber() * 1000),
        })),
      }));
    } catch (error) {
      console.error("Error fetching document signatures:", error);
    }
  };

  const createDocument = async (title, description, fileHash, signers) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log(signer);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );
      console.log(contract);
      const tx = await contract.createDocument(
        title,
        description,
        fileHash,
        signers
      );
      console.log(tx);
      await tx.wait();
      fetchUserDocuments();
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const signDocument = async (documentId, signatureHash) => {
    try {
      const signer = new ethers.BrowserProvider(window.ethereum).getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );
      const tx = await contract.signDocument(documentId, signatureHash);
      await tx.wait();
      getDocumentSignatures(documentId);
    } catch (error) {
      console.error("Error signing document:", error);
    }
  };

  async function fetchAllDocuments() {
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
  

    const signeleContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  
    try {
      
      const documents = await Promise.all(
        [...Array(5)].map(async (_, index) => {
          const document = await signeleContract.getDocument(index);
          return {
            documentId: index,
            title: document.title,
            description: document.description,
            fileHash: document.fileHash,
            signers: document.signers,
            creator: document.creator,
            completed: document.completed
          };
        })
      );
  
      return documents;
    } catch (error) {
      console.error("Error fetching all documents: ", error);
      return [];
    }
  }
  

  useEffect(() => {
    if (address) {
      fetchSigneleEvents("DocumentCreated");
      fetchSigneleEvents("DocumentSigned");
      fetchSigneleEvents("DocumentCompleted");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        provider
      );

      const handleDocumentCreated = (documentId, title, signers, creator) => {
        console.log("Document created:", {
          documentId,
          title,
          signers,
          creator,
        });
        if (creator === address) {
          fetchUserDocuments();
        }
      };

      const handleDocumentSigned = (documentId, signer, signatureHash) => {
        console.log("Document signed:", { documentId, signer, signatureHash });
        if (signer === address) {
          fetchUserDocuments();
        }
        getDocumentSignatures(documentId);
      };

      const handleDocumentCompleted = (documentId) => {
        console.log("Document completed:", documentId);
        getDocument(documentId);
      };

      contract.on("DocumentCreated", handleDocumentCreated);
      contract.on("DocumentSigned", handleDocumentSigned);
      contract.on("DocumentCompleted", handleDocumentCompleted);

      return () => {
        contract.off("DocumentCreated", handleDocumentCreated);
        contract.off("DocumentSigned", handleDocumentSigned);
        contract.off("DocumentCompleted", handleDocumentCompleted);
      };
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchUserDocuments();
    }
  }, [address]);
  const uploadFile = async (file) => {
    console.log(file);
    const response = await lighthouse.upload(
      file,
      "fefed7ea.473a061235334092a53b31da239ec59f"
    );
    console.log(response);
    return response;
  };

  return (
    <AlchemyContext.Provider
      value={{
        alchemy,
        uploadFile,
        createDocument,
        signDocument,
        getDocumentSignatures,
        getDocument,
        userCreatedDocuments,
        userSignedDocuments,
        documentDetails,
        documentSignatures,
        notifications,
        fetchSigneleEvents,
        fetchAllDocuments,
        address
      }}
    >
      {children}
    </AlchemyContext.Provider>
  );
};

export const useAlchemy = () => {
  return useContext(AlchemyContext);
};
