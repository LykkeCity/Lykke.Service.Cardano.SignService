import { Service } from "typedi";
import { Settings } from "../common";

// Cardano JS/WASM module has no typings, so use it as regular node.js module
const CardanoCrypto = require("rust-cardano-crypto");


export enum AddressType {
    external = "External",
    internal = "Internal"
}

@Service()
export class CardanoService {

    constructor(private settings: Settings) {
    }

    private resultOrThrow(result: any): any {
        if (result.failed) {
            throw new Error(result.msg);
        }
        return result.result;
    }

    private walletFromMnemonic(mnemonic: string): any {
        const cryptoWallet = this.resultOrThrow(CardanoCrypto.Wallet.fromDaedalusMnemonic(mnemonic));

        // specify network parameters, it affects address format
        if (!!this.settings.CardanoSignService.network &&
            !!this.settings.CardanoSignService.network.protocolMagic) {
            cryptoWallet.config.protocol_magic = this.settings.CardanoSignService.network.protocolMagic;
        }

        return cryptoWallet;
    }

    generateFirstWalletAddress(mnemonic: string) {
        const cryptoWallet = this.walletFromMnemonic(mnemonic);
        const account = this.resultOrThrow(CardanoCrypto.Wallet.newAccount(cryptoWallet, 0));
        const address = this.resultOrThrow(CardanoCrypto.Wallet.generateAddresses(account, AddressType.internal, [0]));

        return address[0];
    }

    spend(mnemonic: string, inputs: any[], outputs: any[], changeAddress: string) {
        const cryptoWallet = this.walletFromMnemonic(mnemonic);
        const tx = this.resultOrThrow(CardanoCrypto.Wallet.spend(cryptoWallet, inputs, outputs, changeAddress));

        return tx;
    }
}