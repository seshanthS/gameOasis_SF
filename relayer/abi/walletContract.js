module.exports = {
    ABI: [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_userManagerAddress",
                    "type": "address"
                },
                {
                    "internalType": "bytes32[]",
                    "name": "_signatureParams",
                    "type": "bytes32[]"
                },
                {
                    "internalType": "uint8",
                    "name": "_v",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_relayer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_gas",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "_status",
                    "type": "bool"
                }
            ],
            "name": "metaTxExecuted",
            "type": "event"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "internalType": "address payable",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "_data",
                    "type": "bytes"
                },
                {
                    "internalType": "uint256",
                    "name": "_gas",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32[]",
                    "name": "_signatureParams",
                    "type": "bytes32[]"
                },
                {
                    "internalType": "uint8",
                    "name": "_v",
                    "type": "uint8"
                }
            ],
            "name": "execute",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "_status",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_addressToCheck",
                    "type": "address"
                }
            ],
            "name": "isContract",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "result",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]
}