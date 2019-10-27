pragma solidity 0.5.12;

contract userMapper {
    
    address admin;
    bytes walletContractByteCode;
    mapping(address => address)walletContractAddress;
    mapping(address => bool)allowedRelayers;
    uint nonce ;
    
    event userRegistered(address fromSignature, address _walletAddress);
    event walletCreated(address _wallet);
    constructor(address _admin)public{
        admin = _admin;
        
    }
    //0x0687dbee67c4a3e0c487af9e93de76b47bfe15a3fe83219f89458ad29550769a,0x02e802c81e8e9b44f0cda4456a38a6fa39ac5072be458aa1d8f2abe713d897d1,0x147e9c80cf6134da551c0fe99110aa588f7cde9fa4db5a2f15d3048e0306d59c,0x1c,
    modifier onlyRelayers(){
        require(allowedRelayers[msg.sender], "Not a valid Relayer");
        _;
    }
    
    function registerUser(bytes32 messageHash, bytes32 r, bytes32 s, uint8 v, address _walletAddress)public onlyRelayers returns (address){
        address fromSignature = ecrecover(messageHash, v, r, s);
        //address _walletAddress = deployWallet(nonce, _code);
        walletContractAddress[fromSignature] = _walletAddress;
        emit userRegistered(fromSignature, _walletAddress);
        return _walletAddress;
    }
    
    function deployWallet(bytes memory _code) public onlyRelayers returns (address){
        address addressOfWallet;
        nonce ++;
        uint _salt = nonce;
        assembly{
            addressOfWallet := create2(0, add(_code, 0x20),mload(_code), _salt)
            if iszero(extcodesize(addressOfWallet)){
                revert(0,0)
            }
        }
        emit walletCreated(addressOfWallet);
        return addressOfWallet;
    }
        
    function setRelayerValid(address _relayerAddress) public {
        require(msg.sender == admin, "Not an admin");
        allowedRelayers[_relayerAddress] = true;
    }
    
    function getWalletAddress(bytes32 messageHash, bytes32 r, bytes32 s, uint8 v)public view returns (address){
        address fromSignature = ecrecover(messageHash, v, r, s);
        return walletContractAddress[fromSignature];
    }
    
    function isValidRelayer(address _relayerAddress)public view returns (bool){
        return allowedRelayers[_relayerAddress];
    }

    function getAdminAddress() public view returns(address) {
        return admin;
    }
    
    function getNonce()public view returns (uint){
        return nonce;
    }
}