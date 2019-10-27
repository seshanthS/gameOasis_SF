var express = require('express');
var router = express.Router();
let Web3 = require("web3")
let Tx = require('ethereumjs-tx').Transaction
let config = require('../config')
let userManagerABI = require('../abi/userManagerABI').ABI
let walletContractABI = require('../abi/walletContract').ABI
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/execute', async(req,res)=>{
   //bytes32[] memory _signatureParams, uint8 _v
  let signatureHash = req.body.signatureHash;
  let dataParams = req.body.data;
  //TODO - comment for production

  let to = req.body.to;
  let amount = req.body.amount
  let v = req.body.v
  let r = req.body.r
  let s = req.body.s
  let gas = req.body.gas
  let salt = _salt;
  let chain = req.body.chain //matic/main
  let userwalletAddress = req.body.walletAddress
  let providerUrl

  if((gas ||  v ||r || s || signatureHash || to || amount) == undefined) {
    res.send({status: 'fail', reason: 'invalid_params', message:''})
  }
  if(dataParams == undefined){
    dataParams = '0x'
  }

  switch(chain){
    case 'alphaMatic':
      providerUrl = config.networks.alphaMatic.rpc
      break;
    case 'testMatic': 
      providerUrl = config.networks.testMatic.rpc
      break;
    case 'mainnet':
      providerUrl = config.networks.mainnet.rpc
    default:
      res.send({status: 'fail', reason: 'invalid_chain-identifier', message:''})
      return
  }
  
  let web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
  let walletContractInstance = new web3.eth.Contract(walletContractABI, userwalletAddress)
  let trans = await walletContractInstance.methods.execute(to, amount, dataParams, gas, [signatureHash, r, s], v).send({from: wallet[0].address,
    gas:await web3.utils.toHex("8000000") }).then(async hash=>{
      console.log(hash)
      res.send({status: 'success', reason: '', message:hash})
    })
  /* let rawTx = {
    from: config.address,
    to: to,
    data: walletContractInstance.methods.execute(to ,amount, dataParams, gas, [signatureHash, r, s], v).encodeABI(),
    value: amount,
    nonce : await web3.eth.getTransactionCount(config.address),
    gasLimit: gas,
    gasPrice: gasPrice,
  }
  let privKey = Buffer.from(config.privateKey.slice(2),'hex')
  let tx = new Tx(rawTx)
  tx.sign(privKey)
  let serialized = tx.serialize()

  web3.eth.sendSignedTransaction('0x' + serialized.toString('hex'))
  .on('transactionHash', hash=>{
    res.send({status: 'success', reason: '', message:hash})
  }).on('error', err=>{
    res.send({status: 'fail', reason: '', message:err})
  }) */
})

router.post('/register', async(req,res)=>{
  let messageHash = req.body.messageHash;
  let v = req.body.v;
  let r = req.body.r
  let s = req.body.s
  let chain = req.body.chain;
  let gasPrice;
  if((messageHash || v ||r ||s) == undefined) {
    res.send({status: 'fail', reason: 'invalid_params', message:''})
  }

  switch(chain){
    case 'alphaMatic':
      providerUrl = config.networks.alphaMatic.rpc
      break;
    case 'testMatic': 
      providerUrl = config.networks.testMatic.rpc
      break;
    case 'mainnet':
      providerUrl = config.networks.mainnet.rpc
    default:
      res.send({status: 'fail', reason: 'invalid_chain-identifier', message:''})
      return
  }

  let web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
  let userManagerInstance = new web3.eth.Contract(userManagerABI, config.userManagerContract)
  let byteCode = await getByteCode(messageHash, r, s, v);
/*   let gasLimit = await web3.eth.getBlock('latest').gasLimit
  console.log({gasLimit}) */
  if(chain == "testMatic"){
    gasPrice = 0;
  }else{
    gasPrice = await web3.eth.getGasPrice()
  }
  let wallet = await web3.eth.accounts.wallet.create(0)
  let accounts = await wallet.add(config.privateKey)
  //console.log(wallet)
  
  let trans = await userManagerInstance.methods.deployWallet(byteCode).send({from: wallet[0].address,
     gas:await web3.utils.toHex("8000000") }).then(async hash=>{
       console.log(hash.events.walletCreated.returnValues)
       let walletAddress = hash.events.walletCreated.returnValues
      if(hash.status == true){
        await userManagerInstance.methods.registerUser(messageHash, r, s,v, walletContractAddress).send({from: wallet[0].address,
          gas:await web3.utils.toHex("8000000") }).then(secondTx =>{
            if(secondTx.status == true){
              res.send({status: 'success', reason: '', message:''})
            }else{
              res.send({status: 'fail', reason: '', message:''})
            }
          })
      }
     })
  

  
  /*
  let rawTx = {
    from: config.address,
    to: config.userManagerContract,
    data: userManagerInstance.methods.deployWallet(byteCode).encodeABI(),
    gasLimit: await web3.utils.toHex("8000000") ,
    nonce : await web3.eth.getTransactionCount(config.address) ,
    gasPrice: gasPrice
  }
  let privKey = Buffer.from(config.privateKey.slice(2),'hex')
  let tx = new Tx(rawTx)
  await tx.sign(privKey)
  let serialized = tx.serialize()
  let walletContractAddress;
  console.log(serialized)
  console.log(await web3.eth.getTransactionCount(config.address))
  web3.eth.sendSignedTransaction('0x' + serialized.toString('hex'))
  .on('transactionHash', hash=>{
    console.log(hash)
  }).on('receipt', async(receipt)=>{
    console.log(receipt)
    let rawTx = {
      from: config.address,
      to: config.userManagerContract,
      data: userManagerInstance.methods.registerUser(messageHash, r, s,v, walletContractAddress).encodeABI(),
      gasLimit: await web3.utils.toHex("8000000"),
      nonce : await web3.eth.getTransactionCount(config.address),
      gasPrice: gasPrice
    }
    let privKey = Buffer.from(config.privateKey,'hex')
    let tx = new Tx(rawTx)
    tx.sign(privKey)
    let serialized = tx.serialize()
  
     web3.eth.sendSignedTransaction('0x' + serialized.toString('hex')).on('txHash',hash=>{
      console.log(hash)
      res.send('done')
    }) 
  }).on('error', err=>{
    console.log(err)
    res.send({status: 'fail', reason: '', message:err})
  }).catch(error =>console.log) */
})

router.get('/sign', async(req,res)=>{
  //console.log(Web3)
  let result = {};
  let web3 = new Web3(Web3.providers.HttpProvider(config.networks.testMatic.rpc))
  let signature = await web3.eth.accounts.sign("testMessage", config.privateKey)
 // let walletContractInstance = new web3.eth.Contract(abi, "")//change address
  console.log (signature)
  let byteCode = await getByteCode(signature.messageHash, signature.r, signature.s, signature.v);
  //console.log(byteCode);
  result['signatureField'] = signature;
  result['bytecode'] = byteCode
  let addr = await getWalletAddressOffChain(1)
  console.log(addr);
  res.send(result)
})

async function getWalletAddress(sigHash, r, s, v, providerUrl){
  let web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
  let contractInstance = new web3.eth.Contract(userManagerABI, config.userManagerContract)
  return await contractInstance.methods.getWalletAddress(sigHash, r, s, v).call();
}
 //TODO today night
async function getByteCode(hash, r, s, v){
  let web3 = new Web3(Web3.providers.HttpProvider(config.networks.testMatic.rpc))
  let instance = new web3.eth.Contract(walletContractABI, "")
  let byteCodeComplete = await instance.deploy({
    data:config.walletByteCode,
    arguments: [config.userManagerContract, [hash, r, s], v]
  }).encodeABI()
  return await byteCodeComplete;
}

async function getWalletAddressOffChain(salt){
  let web3 = new Web3()
  //return 0x+ web3.utils.sha3(
    let test = ['ff', "0x2fBa909A25ea8De969Ef58C3B2cf5491A9020082", '0x1', web3.utils.sha3(config.testFullByteCode)]
    let halfBaked =  web3.utils.sha3('0x' + (test.map(x=>{return x.replace(/0x/, '')})).join(''))//.slice(-40).toLowerCase())
    return halfBaked.slice(-40)

    /* return `0x${web3.utils.sha3(`0x${[
      'ff',
      "0x2fBa909A25ea8De969Ef58C3B2cf5491A9020082",
      '0x1',
      web3.utils.sha3(config.testFullByteCode)
    ].map(x => {return x.replace(/0x/, '')})
    .join('')}`).slice(-40)}`.toLowerCase() */
}
//0x877f205c35dac921ef0012f4a393fab7ee94cd79 - got Address
//0xf6bf44c13e028a7fcd3bf2627bc6910270ac6062 - actualAddress
module.exports = router;