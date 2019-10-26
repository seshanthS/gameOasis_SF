pragma solidity 0.5.12;

contract userMapper {
    
    address admin;
    bytes walletContractByteCode;
    mapping(address => address)walletContractAddress;
    mapping(address => bool)allowedRelayers;
    
    event userRegistered(address fromSignature, address _walletAddress);
    
    constructor(address _admin, bytes memory _walletContractByteCode)public{
        admin = _admin;
        walletContractByteCode = _walletContractByteCode;
    }
    
    modifier onlyRelayers(){
        require(allowedRelayers[msg.sender], "Not a valid Relayer");
        _;
    }
    
    function registerUser(bytes32 messageHash, bytes32 r, bytes32 s, uint8 v)public onlyRelayers returns (address){
        address fromSignature = ecrecover(messageHash, v, r, s);
        address _walletAddress = deployWallet(1);
        walletContractAddress[fromSignature] = _walletAddress;
        emit userRegistered(fromSignature, _walletAddress);
        return _walletAddress;
    }
    
    function deployWallet(uint _salt) internal returns (address){
        bytes memory _code = walletContractByteCode;
        address addressOfWallet;
        assembly{
            addressOfWallet := create2(0, add(_code, 0x20),mload(_code), _salt)
            if iszero(extcodesize(addressOfWallet)){
                revert(0,0)
            }
        }
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
}