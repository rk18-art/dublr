const { ethers } = require("hardhat");

// Run with: npx hardhat run --network maticmum scripts/deploy.js 

// Note: deployment should be the first thing that is done with the deploying wallet
// on every chain, so that nonce = 0 on deployment to each chain, so that the contract
// gets the same address on all chains.

// Ensure you have registered the ABI with 4byte.directory: https://www.4byte.directory/submit/
// This is used by MetaMask to resolve function names.

async function main() {
    const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, ethers.provider);
    console.log("Deploying from address: " + signer.address);

    const Dublr = await ethers.getContractFactory("Dublr", signer);

    // mintPrice = 0.000005   => mintPrice_x1e9 == mintPrice * 1e9 == 5000
    // mintETHEquiv = 10000
    // mintETHWEIEquiv = mintETHEquiv * 1e18
    // initialMintDUBLRWEI = mintETHWEIEquiv / mintPrice
    // == 2000000000000000000000000000 DUBLR wei (2B DUBLR, 10k ETH equiv @ 0.000005 ETH per DUBLR)
    try {
        const balanceBefore = await signer.getBalance();
    } catch (e) {
        console.log(e.message);
        throw e;
    }
    // const dublr = await Dublr.deploy(5000, "2000000000000000000000000000");
    // Actually, don't deploy with any tokens assigned to owner:
    // https://www.sec.gov/corpfin/framework-investment-contract-analysis-digital-assets
    // There may be a reasonable expectation of profits if "The AP [Active Participant] is able to
    // benefit from its efforts as a result of holding the same class of digital assets as those
    // being distributed to the public."
    const dublr = await Dublr.deploy(5000, 0);
    const balanceAfter = await signer.getBalance();
    const deploymentCost = balanceBefore.sub(balanceAfter);

    console.log("Token address:", dublr.address);
    console.log("Deployment cost: " + ethers.utils.formatEther(deploymentCost) + " ETH");
    console.log("Contract ABI:", dublr.interface.format(ethers.utils.FormatTypes.full));
    
    // N.B. public interface (buy, sell, and cancelMySellOrder) should be registered with
    // https://www.4byte.directory/ in order for MetaMask to show the name of the non-view
    // functions called.
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
