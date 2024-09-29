const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Signele", function () {
  async function deploySigneleFixture() {
    const [owner, signer1, signer2, signer3] = await ethers.getSigners();
    const Signele = await ethers.getContractFactory("Signele");
    const signele = await Signele.deploy();
    return { signele, owner, signer1, signer2, signer3 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { signele, owner } = await loadFixture(deploySigneleFixture);
      expect(await signele.owner()).to.equal(owner.address);
    });
  });

  describe("Document Creation", function () {
    it("Should create a document with correct details", async function () {
      const { signele, signer1, signer2 } = await loadFixture(deploySigneleFixture);
      const title = "Test Document";
      const fileHash = "QmTest...";
      const signers = [signer1.address, signer2.address];

      await expect(signele.createDocument(title, fileHash, signers))
        .to.emit(signele, "DocumentCreated")
        .withArgs(0, title, signers, await signele.signer.getAddress());

      const document = await signele.getDocument(0);
      expect(document.title).to.equal(title);
      expect(document.fileHash).to.equal(fileHash);
      expect(document.signers).to.deep.equal(signers);
      expect(document.creator).to.equal(await signele.signer.getAddress());
      expect(document.completed).to.be.false;
    });

    it("Should revert if no signers are provided", async function () {
      const { signele } = await loadFixture(deploySigneleFixture);
      await expect(signele.createDocument("Test", "Hash", []))
        .to.be.revertedWith("At least one signer is required");
    });
  });

  describe("Document Signing", function () {
    it("Should allow authorized signer to sign a document", async function () {
      const { signele, signer1, signer2 } = await loadFixture(deploySigneleFixture);
      await signele.createDocument("Test", "Hash", [signer1.address, signer2.address]);

      const signatureHash = "0xabcd...";
      await expect(signele.connect(signer1).signDocument(0, signatureHash))
        .to.emit(signele, "DocumentSigned")
        .withArgs(0, signer1.address, signatureHash);

      expect(await signele.hasSignerSigned(0, signer1.address)).to.be.true;
    });

    it("Should complete the document when all signers have signed", async function () {
      const { signele, signer1, signer2 } = await loadFixture(deploySigneleFixture);
      await signele.createDocument("Test", "Hash", [signer1.address, signer2.address]);

      await signele.connect(signer1).signDocument(0, "0xabcd...");
      await expect(signele.connect(signer2).signDocument(0, "0xefgh..."))
        .to.emit(signele, "DocumentCompleted")
        .withArgs(0);

      const document = await signele.getDocument(0);
      expect(document.completed).to.be.true;
    });

    it("Should revert if an unauthorized signer tries to sign", async function () {
      const { signele, signer1, signer3 } = await loadFixture(deploySigneleFixture);
      await signele.createDocument("Test", "Hash", [signer1.address]);

      await expect(signele.connect(signer3).signDocument(0, "0xabcd..."))
        .to.be.revertedWith("Not authorized to sign");
    });

    it("Should revert if a signer tries to sign twice", async function () {
      const { signele, signer1 } = await loadFixture(deploySigneleFixture);
      await signele.createDocument("Test", "Hash", [signer1.address]);

      await signele.connect(signer1).signDocument(0, "0xabcd...");
      await expect(signele.connect(signer1).signDocument(0, "0xefgh..."))
        .to.be.revertedWith("Already signed");
    });
  });

  describe("Document Retrieval", function () {
    it("Should return correct document details", async function () {
      const { signele, signer1, signer2 } = await loadFixture(deploySigneleFixture);
      const title = "Test Document";
      const fileHash = "QmTest...";
      const signers = [signer1.address, signer2.address];

      await signele.createDocument(title, fileHash, signers);
      const document = await signele.getDocument(0);

      expect(document.title).to.equal(title);
      expect(document.fileHash).to.equal(fileHash);
      expect(document.signers).to.deep.equal(signers);
      expect(document.creator).to.equal(await signele.signer.getAddress());
      expect(document.completed).to.be.false;
    });

    it("Should return correct document signatures", async function () {
      const { signele, signer1, signer2 } = await loadFixture(deploySigneleFixture);
      await signele.createDocument("Test", "Hash", [signer1.address, signer2.address]);

      const signatureHash1 = "0xabcd...";
      const signatureHash2 = "0xefgh...";
      await signele.connect(signer1).signDocument(0, signatureHash1);
      await signele.connect(signer2).signDocument(0, signatureHash2);

      const signatures = await signele.getDocumentSignatures(0);
      expect(signatures.length).to.equal(2);
      expect(signatures[0].signer).to.equal(signer1.address);
      expect(signatures[0].signatureHash).to.equal(signatureHash1);
      expect(signatures[1].signer).to.equal(signer2.address);
      expect(signatures[1].signatureHash).to.equal(signatureHash2);
    });
  });

  describe("User Document Lists", function () {
    it("Should return correct list of created documents for a user", async function () {
      const { signele, signer1, signer2 } = await loadFixture(deploySigneleFixture);
      await signele.createDocument("Test1", "Hash1", [signer1.address]);
      await signele.createDocument("Test2", "Hash2", [signer2.address]);

      const createdDocs = await signele.getUserCreatedDocuments(await signele.signer.getAddress());
      expect(createdDocs.length).to.equal(2);
      expect(createdDocs[0]).to.equal(0);
      expect(createdDocs[1]).to.equal(1);
    });

    it("Should return correct list of signed documents for a user", async function () {
      const { signele, signer1, signer2 } = await loadFixture(deploySigneleFixture);
      await signele.createDocument("Test1", "Hash1", [signer1.address, signer2.address]);
      await signele.createDocument("Test2", "Hash2", [signer1.address, signer2.address]);

      await signele.connect(signer1).signDocument(0, "0xabcd...");
      await signele.connect(signer1).signDocument(1, "0xefgh...");

      const signedDocs = await signele.getUserSignedDocuments(signer1.address);
      expect(signedDocs.length).to.equal(2);
      expect(signedDocs[0]).to.equal(0);
      expect(signedDocs[1]).to.equal(1);
    });
  });

  describe("Pausable Functionality", function () {
    it("Should allow owner to pause and unpause the contract", async function () {
      const { signele, owner } = await loadFixture(deploySigneleFixture);

      await signele.connect(owner).pause();
      await expect(signele.createDocument("Test", "Hash", [owner.address]))
        .to.be.revertedWith("Pausable: paused");

      await signele.connect(owner).unpause();
      await expect(signele.createDocument("Test", "Hash", [owner.address]))
        .to.not.be.reverted;
    });

    it("Should not allow non-owner to pause or unpause", async function () {
      const { signele, signer1 } = await loadFixture(deploySigneleFixture);

      await expect(signele.connect(signer1).pause())
        .to.be.revertedWith("Only the owner can call this function");
      await expect(signele.connect(signer1).unpause())
        .to.be.revertedWith("Only the owner can call this function");
    });
  });
});