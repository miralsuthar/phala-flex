# Phala Flex

**Phala Flex** introduces a novel approach to engaging with smart contracts, integrating an identity verification system using **Time-Based One-Time Passwords** (TOTP). Users are required to authenticate themselves through third-party authenticator apps such as Authy or Google Authenticator before gaining access to specific functions that demand authentication. 

<p align="center">
<img src="https://github.com/miralsuthar/phala-flex/assets/76066586/3fd6adda-38be-4b91-9737-c5391194fb7f" height=300 />
</p>

The primary problem addressed by Phat contracts is the validation of One-Time Passwords (OTPs) off-chain to confirm the authenticity of user-submitted TOTP transactions. When a user submits a TOTP, it undergoes off-chain validation, and if it's deemed valid, access is granted to execute a specific action associated with a function that necessitates the initial authentication. Subsequent to the successful execution of the function transaction, the contract can be disabled, requiring re-verification of the TOTP for any future executions.
