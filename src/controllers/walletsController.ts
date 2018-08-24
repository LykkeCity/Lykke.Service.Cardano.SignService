import { JsonController, Post } from "routing-controllers";
import { generateMnemonic } from "bip39";
import { CardanoService } from "../services/cardanoService";
import { toBase64 } from "../common";


@JsonController("/wallets")
export class WalletsController {

    constructor(private cardano: CardanoService) {
    }

    @Post()
    createWallet() {
        const mnemonic = generateMnemonic(160);
        const publicAddress = this.cardano.generateFirstWalletAddress(mnemonic);

        return {
            privateKey: toBase64(mnemonic),
            publicAddress
        };
    }
}