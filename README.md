# Phala Flex

**Phala Flex** introduces a novel approach to engaging with smart contracts, integrating an identity verification system using **Time-Based One-Time Passwords** (TOTP). Users are required to authenticate themselves through third-party authenticator apps such as Authy or Google Authenticator before gaining access to specific functions that demand authentication. 

<p align="center">
<img src="https://github.com/miralsuthar/phala-flex/assets/76066586/3fd6adda-38be-4b91-9737-c5391194fb7f" height=400 />
</p>

The primary problem addressed by Phat contracts is the validation of One-Time Passwords (OTPs) off-chain to confirm the authenticity of user-submitted TOTP transactions. When a user submits a TOTP, it undergoes off-chain validation, and if it's deemed valid, access is granted to execute a specific action associated with a function that necessitates the initial authentication. Subsequent to the successful execution of the function transaction, the contract can be disabled, requiring re-verification of the TOTP for any future executions.

## How Phala Flex Works?

The basic mechanism behind how the PhalaFlex smart contract interacts with the Phat function is shown below:

<p align="center">
<img src="https://github.com/miralsuthar/phala-flex/assets/76066586/34587c06-0e23-424e-832c-fd14807fd23b" height=450 />
</p>

There are 3 major function types that make this a great way to store your native and ERC20 tokens:
- Deposit as an Owner
- Withdraw
  - As an Owner
  - As a Beneficiary
- Request
  - As an Owner
  - As a Beneficiary

When you deposit as an owner, the Phala Flex consumer contract takes care of all your assets until you withdraw them as an owner or as a beneficiary. 
After you register, you can stake some native tokens into the contract. And later, when you need them, you can just enter the TOTP and run the withdraw function after you get authorized to access the function.
If in any case, your owner's EOA wallet gets compromised then you can use your beneficiary wallet to redeem your native tokens with the TOTP of the owner's account (because you are accessing their account).

## Demo & Website for the dapp

Testnet: https://phala-flex-42pk5vdcs-miralsuthar.vercel.app/

Mainnet: https://phala-flex.vercel.app (Might not work: refer Note below for more information on the same)

Demo: [Youtube Link](https://youtu.be/250jKLzOomI)

## Contract Information

You can find all the details about the smart contract and phat function through this repo: [PhalaFlex](https://github.com/keshavsharma25/PhalaFlex)
Here is the all the information you need regarding the contract and phat function:
- Polygon Mainnet:
  - dUSD address (a dummy erc20 address for demo): `0x2eF7C4ce244bc84d25ac7e6Fc72fcB000101a207`
  - Phala flex contract address: `0x875b43C28C37A96D531719644960c71e32Ea7801`
  - Polkadot Phat Function deployer's address: `5D1y7Gz9jnrLu34ZgdawRrbMaqWJi1JKE8rnPotKd6ekyu6w`
  - Attestor Address: `0x32ff138fbcef0c8e9819979aab20f3328daf4995`
- Polygon Mumbai:
  - dUSD address: `0x203FCc4de1768769a96CF0142ADf9Cf9d139510B`
  - Phala flex contract address: `0x748B2e407D720E5a1a53e0B3eC37cf669B8C6ebE`
  - Polkadot Phat Function deployer's address: `5Gbp292ifXiDhkoPVMe3T4TxEDrE9ngyK7JB1bpRuT59cgL1`
  - Attestor Address: `0xbcd96d3e59b65d650910f2ae736d7437022b64d4`

**Note**: When deploying the Phat Function to Mainnet, there was an error related to authorizing the evm account: `failed to get evm address from profile: NoAuthorizedExternalAccount`. So, the demo shown here, is using Testnet.

