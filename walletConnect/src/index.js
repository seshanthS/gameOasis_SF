import WalletConnect from "@walletconnect/browser";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3"
import { sign } from "crypto";

let status;
const provider = new WalletConnectProvider({
  infuraId: "27e484dcd9e3efcfd25a83a78777cdf1" // Required
});
 
//  Enable session (triggers QR Code modal)

const web3 = new Web3(provider);
provider.on("accountsChanged", (accounts) => {
  console.log(accounts);
});
 
// Subscribe to chainId change
provider.on("chainChanged", (chainId) => {
  console.log(chainId);
});
 
// Subscribe to networkId change
provider.on("networkChanged", (networkId) => {
  console.log(networkId);
});
 
// Subscribe to session connection/open
provider.on("open", () => {
  console.log("open");
  status = "open"
});
 
// Subscribe to session disconnection/close
provider.on("close", (code, reason) => {
  console.log(code, reason);
  status = "close"
});

const walletConnector = new WalletConnect({
  bridge: "https://bridge.walletconnect.matic.today",//"https://bridge.walletconnect.org", // Required 'https://walletconnect.matic.network'
    dappName:"stickRun"
  
});
walletConnector.on("session_update", (error, payload) => {
  if (error) {
    throw error;
  }
  window.account = payload.params[0].accounts
  console.log('session Update', payload)
});

//let sdkMatic = {
  
 //import WaletConnectProvider  from "@walletconnect/web3-provider"
//require("expose-loader?test2")	


let sdkMatic = {
  connectWallet : async function (){

  // Check if connection is already established
  if (!walletConnector.connected) {
    // create new session
    walletConnector.createSession().then(() => {
      // get uri for QR Code modal
      const uri = walletConnector.uri;
      // display QR Code modal
      WalletConnectQRCodeModal.open(uri, () => {
        console.log("QR Code Modal closed");
      });
    });
  }
  
  // Subscribe to connection events
  walletConnector.on("connect", async(error, payload) => {
    if (error) {
      throw error;
    }
    window.account = payload.params[0].accounts
    
    // Close QR Code Modal
    WalletConnectQRCodeModal.close();
  
    // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0];
    console.log(accounts[0], chainId)
    
  })
  },
  
  connectInternal : async function(){
   
    await provider.enable()
 
},

signInternal: async function(msg){
  await this.connectInternal()
  let signature = await web3.eth.sign(msg);
},

sign :(msg)=>{
  this.signInternal(msg)
},



test1: async function (){
   
  
  // Check if connection is already established
  if (!walletConnector.connected) {
    // create new session
    walletConnector.createSession().then(() => {
      // get uri for QR Code modal
      const uri = walletConnector.uri;
      // display QR Code modal
      WalletConnectQRCodeModal.open(uri, () => {
        console.log("QR Code Modal closed");
      });
    });
  }else{
    return
  }
  
  // Subscribe to connection events
  walletConnector.on("connect", async(error, payload) => {
    if (error) {
      throw error;
    }
  
    // Close QR Code Modal
    WalletConnectQRCodeModal.close();
  
    // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0];
    console.log(accounts[0], chainId)
    
    //unityInstance.SendMessage('sdkUnity', 'getData', 5);
    return payload;
    const message = "message Signed for stickRun";
    
    let web3 = new Web3()
    let hash = await web3.eth.accounts.hashMessage(message)
    console.log(hash)
     
  // Sign message
  
  });
  
  walletConnector.on("session_update", (error, payload) => {
    if (error) {
      throw error;
    }
    window.account = payload.params[0].accounts
    console.log('session Update', payload)
    // Get updated accounts and chainId
   /*  const { accounts, chainId } = payload.params[0];
    console.log(accounts, chainId)
    const message = "My email is john@doe.com - 1537836206101";
  
  const msgParams = [
    "0xbc28ea04101f03ea7a94c1379bc3ab32e65e62d3",                            // Required
    keccak256("\x19Ethereum Signed Message:\n" + len(message) + message)   // Required
  ]; */
  
  
  // Sign message
  walletConnector
    .signMessage(msgParams)
    .then((result) => {
      // Returns signature.
      console.log(result)
    })
    .catch(error => {
      // Error returned when rejected
      console.error(error);
    }) 
  });
  
  walletConnector.on("disconnect", (error, payload) => {
    if (error) {
      throw error;
    }
  
    // Delete walletConnector
  });
},
// Create a walletConnector
test2 : function (){
  console.log("calling test function...")
  this.test1()
  //sdkUnity.test1()
},

sign : async function(account, message){
  walletConnector
    .signMessage([account,message])
    .then((result) => {
      // Returns signature.
      console.log(result)
      return result
    })
    .catch(error => {
      // Error returned when rejected
      console.error(error);
      return "error"
    })
},

postToRelayer : async()=>{

},

signAndSendToRelayer: async function(data){
  await this.connectWallet();
  let signature =  this.sign(walletConnector._accounts[0], data)
  this.postToRelayer();
}
} 
//document.body.appendChild(testFunction());
window.sdkMatic = sdkMatic
//window.func1 = testFunction
