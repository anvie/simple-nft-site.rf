import { FC, useEffect, useState } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { ethRpcError } from "../lib/ErrorHandler";

import contractAbi from "../lib/$name_pascal_case$-$param.network_id$-abi.json";
import styled from "styled-components";
import LoadingCircle from "./LoadingCircle";

interface Props {
  onMintSuccess: (tx: any) => void;
  ethAddress: string;
  web3: Web3;
  title?: string;
}

const MintDialog: FC<Props> = ({ ethAddress, web3, onMintSuccess, title }) => {
  const [loaded, setLoaded] = useState(false);
  const [enableMintButton, setEnableMintButton] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [inProcessing, setInProcessing] = useState(false);
  const [waitMetamask, setWaitMetamask] = useState(false);
  const [contract, setContract] = useState<any>(null);
  const [contractLoaded, setContractLoaded] = useState(false);

  useEffect(() => {
    if (web3) {
      if (!process.env.SMART_CONTRACT_ADDRESS) {
        throw Error("SMART_CONTRACT_ADDRESS is not defined");
      }
      console.log("SC address:", process.env.SMART_CONTRACT_ADDRESS);
      const _contract = new web3.eth.Contract(
        contractAbi as unknown as AbiItem,
        process.env.SMART_CONTRACT_ADDRESS
      );
      console.log(
        "🚀 ~ file: Mint.tsx ~ line 82 ~ useEffect ~ _contract",
        _contract
      );
      setContract(_contract);
      console.log("contract loaded");
      setContractLoaded(true);
    }
  }, [web3]);

  // useEffect(() => {
  //   // get gas prices
  //   fetch("https://api.chainbox.id/v1/gas-prices")
  //     .then((res: any) => {
  //       console.log("🚀 ~ file: Mint.tsx ~ line 95 ~ .then ~ res", res);
  //       if (res.result) {
  //         setGasPrices(res.result.gasPrices);
  //       }
  //     })
  //     .catch((err: any) => {
  //       console.error("[ERROR]", err);
  //     });
  // }, [web3]);

  useEffect(() => {
    if (contract) {
      setEnableMintButton(true);
    }
  }, [contract]);

  async function watchTransaction(tx: any) {
    console.log("🚀 tx.hash", tx.transactionHash);
    web3.eth
      .getTransactionReceipt(tx.transactionHash)
      .then((receipt) => {
        console.log(
          "🚀 ~ file: MintDialog.tsx ~ line 165 ~ web3.eth.getTransactionReceipt ~ receipt",
          receipt
        );

        if (!receipt || !receipt.status) {
          console.log("no receipt");
          return;
        }

        if (receipt.blockNumber > 0) {
          onMintSuccess(tx);
          // setInCreating(false);
        }
      })
      .catch((err: any) => {
        console.error(err);
        console.log("Cannot watch transaction");
      });
  }

  async function doMint() {
    if (contract && web3) {
      // const gasPrice = web3.utils
      //   .toBN("1000000000")
      //   .mul(web3.utils.toBN(parseInt(gasPrices[process.env.NETWORK_ID!])));
      const gasPrice = web3.utils.toBN("1000000000").mul(web3.utils.toBN(50)); // 50 Gwei
      console.log("ethAddress:", ethAddress);
      const sendData: any = {
        from: ethAddress,
        gasPrice,
        gas: "2100000",
        gasLimit: web3.utils.toHex(610000),
        nonce: web3.utils.toHex(
          await web3.eth.getTransactionCount(ethAddress, "pending")
        ),
      };

      setWaitMetamask(true);
      setEnableMintButton(false);

      contract.methods
        .mint(ethAddress)
        .send(sendData)
        .then((_tx: any) => {
          console.log(_tx);
          watchTransaction(_tx);
        })
        .catch((err: any) => {
          setErrorInfo(ethRpcError(err));
          setTimeout(() => setErrorInfo(null), 1000);
          // alert(ethRpcError(err))
        })
        .finally(() => {
          setWaitMetamask(false);
          setEnableMintButton(true);
        });
    }
  }

  return (
    <div className="p-5">
      <div className="pt-2">
        <div
          className={
            enableMintButton
              ? `text-white flex mt-5 pt-2 pb-2 pr-6 pl-5 space-x-2 text-lg rounded-xl w-auto cursor-pointer items-center bg-violet-600 hover:bg-violet-500 text-center justify-center hover:shadow-md hover:text-white`
              : `text-white flex mt-5 pt-2 pb-2 pr-6 pl-5 space-x-2 text-lg rounded-xl w-auto items-cente bg-gray-500 text-center justify-center disabled`
          }
          onClick={enableMintButton ? doMint : () => {}}
        >
          {waitMetamask && <LoadingCircle />}

          <div>MINT</div>
        </div>
      </div>
    </div>
  );
};

export default MintDialog;

const StyledModal = styled.div`
  padding-top: 10px;
  z-index: 900;
  font-family: Consolas, Monaco, monospace;
`;
