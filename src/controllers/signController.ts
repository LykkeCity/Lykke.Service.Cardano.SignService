import { JsonController, Body, Post, BadRequestError, Get, Param } from "routing-controllers";
import { IsArray, IsString, IsNotEmpty, IsBase64, Length, MinLength, ArrayNotEmpty, ArrayMinSize, ArrayMaxSize } from "class-validator";
import { fromBase64 } from "../common";
import { CardanoService } from "../services/cardanoService";


class SignTransactionRequest {

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    @ArrayMaxSize(1)
    privateKeys: string[];

    // @IsString()
    // @IsNotEmpty()
    // @IsBase64()
    // transactionContext: string;

    transactionContext: TransactionContext;
}

class SignTransactionResponse {
    constructor(public signedTransaction: string) {
    }
}

class TransactionContext {
    inputs: any[];
    outputs: any[];
    changeAddress: string;
}

@JsonController("/sign")
export class SignController {

    constructor(private cardano: CardanoService) {
    }

    @Post()
    signTransaction(@Body({ required: true }) request: SignTransactionRequest): SignTransactionResponse {
        const ctx = request.transactionContext; //fromBase64<TransactionContext>(request.transactionContext);
        const trx = this.cardano.spend(fromBase64(request.privateKeys[0]), ctx.inputs, ctx.outputs, ctx.changeAddress);

        return new SignTransactionResponse(trx);
    }

    @Get("utxo/:address")
    getUTXO(@Param("address") address: string) {
        
    }
}