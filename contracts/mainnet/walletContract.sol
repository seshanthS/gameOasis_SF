pragma solidity 0.5.12;
pragma experimental ABIEncoderV2;
contract userManager {
    function isValidRelayer(address) public returns (bool) ;
}

contract wallet{
    bytes userName;
    address userManagerAddress;
    userManager _userManager;
    
    address user;
    mapping(address => bool)authorisedAddresses; //user's own keys for accessing this contract wallet.
    
    event metaTxExecuted(address indexed _from, address indexed _relayer, address _to, uint _amount, uint _gas, bool _status);
    
    /* _signatureParams[0] = messageHash
       _signatureParams[1] = r
       _signatureParams[2] = s
    */
    constructor(address _userManagerAddress, bytes32[] memory _signatureParams, uint8 _v )public {
        userManagerAddress = _userManagerAddress;
        user = ecrecover(_signatureParams[0], _v, _signatureParams[1], _signatureParams[2]);
    }
    
    // function execute0(address _param1, address _param2, uint _param3, uint _param4, bytes memory _param5)public {
    //     _userManager = userManager(userManagerAddress);
    //     _walletLogic = walletLogic(walletLogicContractAddress);
    //     require( _userManager.isValidRelayer(msg.sender) == true || authorisedAddresses[msg.sender] == true, "Not a valid Relayer");
    //     _walletLogic.execute(_param1, _param2, _param3, _param4, _param5);// change to delegate call
    // }
    
    /* _signatureParams[0] = messageHash
       _signatureParams[1] = r
       _signatureParams[2] = s
    */
    function execute(address payable  _to, uint _amount, bytes memory _data, uint _gas, bytes32[] memory _signatureParams, uint8 _v ) public returns (bool _status){
        _userManager = userManager(userManagerAddress);
        require(ecrecover(_signatureParams[0], _v, _signatureParams[1], _signatureParams[2]) == user, "Not a valid Signature");
        require( _userManager.isValidRelayer(msg.sender) == true , "Not a valid Relayer");
        if(_data.length == 0){
                _to.transfer(_amount);
             }else{
                assembly{
                    _status := call(_gas,_to,_amount, add(_data, 0x20),mload(_data),0,0) 
                }
            } 
        emit metaTxExecuted(address(this), msg.sender, _to, _amount, _gas, _status);
        return true;
    }
    
    function isContract(address _addressToCheck)public view returns(bool result){
        uint size;
        assembly {
            size := extcodesize(_addressToCheck)
        }
        if(size > 0){
            return true;
        }else {
            return false;
        }
    }
    
    function () external payable{
        
    }
     
}