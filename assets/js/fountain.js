var currentAddr = null;
var web3;
var spend;
var usrBal;
var priceInUSD;



var maxDeposit=0
var minDeposit=0
var totalDeposits=0
var lastUpdate = new Date().getTime()
var contractBalance;





var contract;

const deadAddress = '0x000000000000000000000000000000000000dEaD';
const fountainAddress = '0x61BA6c37330bE6CCbA959ef96479836FC516dFbE'; //mainnet contract   
const tokenAddress = '0x34E76FA9cd853D185DfDB4770F96A059F328E5C0'; //mainnet Token

var tokenContract;
var started = true;
var canSell = true;

const tokenAbi = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getCirculatingSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ]

const fountainAbi = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "amountPLS", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountBOG", "type": "uint256" } ], "name": "AutoLiquify", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [], "name": "CirculatingSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" } ], "name": "ZeusProtocol", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "_maxTxAmount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "address", "name": "routerAddress", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" } ], "name": "addRewardToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "holder", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" } ], "name": "approveMax", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "authorize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "distributeManual", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "distributor", "outputs": [ { "internalType": "contract DividendDistributor", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "distributorGas", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "feeDenominator", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getCirculatingSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "accuracy", "type": "uint256" } ], "name": "getLiquidityBacking", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getOwner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "getRewardTokenInfo", "outputs": [ { "internalType": "address", "name": "tokenAddress", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "isAuthorized", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "target", "type": "uint256" }, { "internalType": "uint256", "name": "accuracy", "type": "uint256" } ], "name": "isOverLiquified", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isOwner", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "pair", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "index", "type": "uint256" } ], "name": "removeRewardToken", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "router", "outputs": [ { "internalType": "contract IDEXRouter", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_minPeriod", "type": "uint256" }, { "internalType": "uint256", "name": "_minDistribution", "type": "uint256" } ], "name": "setDistributionCriteria", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "gas", "type": "uint256" } ], "name": "setDistributorSettings", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_autoLiquidityReceiver", "type": "address" }, { "internalType": "address", "name": "_marketingReceiver", "type": "address" }, { "internalType": "address", "name": "_growthReceiver", "type": "address" }, { "internalType": "address", "name": "_morgue", "type": "address" } ], "name": "setFeeReceivers", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_buyFee", "type": "uint256" }, { "internalType": "uint256", "name": "_buyBurnFee", "type": "uint256" }, { "internalType": "uint256", "name": "_feeDenominator", "type": "uint256" } ], "name": "setFeesForBuy", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_sellFee", "type": "uint256" }, { "internalType": "uint256", "name": "_sellBurnFee", "type": "uint256" }, { "internalType": "uint256", "name": "_feeDenominator", "type": "uint256" } ], "name": "setFeesForSell", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "holder", "type": "address" }, { "internalType": "bool", "name": "exempt", "type": "bool" } ], "name": "setIsBuyFeeExempt", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "holder", "type": "address" }, { "internalType": "bool", "name": "exempt", "type": "bool" } ], "name": "setIsSellFeeExempt", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "holder", "type": "address" }, { "internalType": "bool", "name": "exempt", "type": "bool" } ], "name": "setIsTxLimitExempt", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_liquidityFee", "type": "uint256" }, { "internalType": "uint256", "name": "_marketingFee", "type": "uint256" }, { "internalType": "uint256", "name": "_reflectionFee", "type": "uint256" }, { "internalType": "uint256", "name": "_growthFee", "type": "uint256" }, { "internalType": "uint256", "name": "_zeusFee", "type": "uint256" }, { "internalType": "uint256", "name": "_feeDenominator", "type": "uint256" } ], "name": "setSwapBackMetrics", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "bool", "name": "_enabled", "type": "bool" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" } ], "name": "setSwapBackSettings", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_target", "type": "uint256" }, { "internalType": "uint256", "name": "_denominator", "type": "uint256" } ], "name": "setTargetLiquidity", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "swapEnabled", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "swapThreshold", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "systemRecovery", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "targetLiquidity", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "targetLiquidityDenominator", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalBuyFee", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSellFee", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSwapMetric", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "adr", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "unauthorize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" } ]



// ------ contract calls
function loadContracts() {
    console.log('Loading contracts...')
    web3 = window.web3
    contract = new web3.eth.Contract(fountainAbi, fountainAddress);
    tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
    console.log('Done loading contracts.')
}

function myReferralLink(address) {
    var prldoc = document.getElementById('reflink');
    // Get the current page URL
    var currentPageURL = window.location.href;
    // Update the referral link content
    prldoc.textContent = currentPageURL + "?ref=" + address;
    // Assuming you have an input field with the id "reflink" to copy the generated link
    var copyText = document.getElementById("reflink");
    copyText.value = prldoc.textContent;
}


async function myConnect() {
    var element = document.getElementById("dotting");
    element.classList.toggle("dot");
}

async function connect() {
    console.log('Connecting to wallet...')
    try {
        if (started) {
            $('#buy-eggs-btn').attr('disabled', false)
        }
        var accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length == 0) {
            console.log('Please connect to MetaMask.');
            $('#enableMetamask').html('Connect')
        } else if (accounts[0] !== currentAddr) {
            loginActions(accounts);
        }
    } catch (err) {
        if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            alert('Please connect to MetaMask.');
        } else {
            console.error(err);
        }
        $('#enableMetamask').attr('disabled', false)
    }
}

function loginActions(accounts) {
    currentAddr = accounts[0];
    if (currentAddr !== null) {
        myReferralLink(currentAddr);
        console.log('Wallet connected = ' + currentAddr);

        loadContracts();
        refreshData();

        let shortenedAccount = currentAddr.replace(currentAddr.substring(3, 39), "***");
        $('#enableMetamask').html(shortenedAccount);
    }
    $('#enableMetamask').attr('disabled', true);
}

async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        $('#enableMetamask').attr('disabled', false)
        if (window.ethereum.selectedAddress !== null) {
            await connect();
                setTimeout(function () {
                controlLoop()
                controlLoopFaster()
            }, 1000)
        }
    } else {
        $('#enableMetamask').attr('disabled', true)
    }
}

window.addEventListener('load', function () {
    setStartTimer();
    loadWeb3()
})

$('#enableMetamask').click(function () {
    connect()
});

function controlLoop() {
    refreshData()
    setTimeout(controlLoop, 25000)
}

function controlLoopFaster() {
    setTimeout(controlLoopFaster, 30)
}

function roundNum(num) {
    if (num == 0) { return 0};
    if (num < 1) {
        return parseFloat(num).toFixed(4)
    }
    return parseFloat(parseFloat(num).toFixed(2));
}

function refreshData() {
    console.log('Refreshing data...')
    if(!contract || !contract.methods){
        console.log('contract is not yet loaded')
        loadContracts()
        // return;
    }

    contract.methods.COMPOUND_TAX().call().then(r => {
        var cmpTAX = Number(r / 10).toFixed(0);
        $("#cmp-tax").html(`${cmpTAX}% Compound Fee`)
        $("#cmp-percent").html(`${cmpTAX}%`)
    }).catch((err) => {
        console.log('COMPOUND_TAX', err);
    });
    

    contract.methods.REFERRAL().call().then(r => {
        var refPercent = Number(r / 10).toFixed(0);
        $("#ref-bonus").html(`${refPercent}% Referral Bonus`)
        $("#ref-percent").html(`${refPercent}%`)
    }).catch((err) => {
        console.log('REFERRAL', err);
    });

    contract.methods.DAILY_INTEREST().call().then(r => {
        var dailyPercent = Number(r / 10).toFixed(0);
        $("#dbonus").html(`${dailyPercent}% Daily Percent`)
        $("#dpercent").html(`${dailyPercent}%`)
    }).catch((err) => {
        console.log('DAILY_INTEREST', err);
    });

    contract.methods.WALLET_DEPOSIT_LIMIT().call().then(busd => {
        maxDeposit = busd;
        $("#max-deposit").html(`${readableBUSD(busd, 2)}`)
    }).catch((err) => {
        console.log('WALLET_DEPOSIT_LIMIT', err);
    });
	
	contract.methods.MIN_INVEST_LIMIT().call().then(busd => {
        minDeposit = busd;
        $("#min-deposit").html(`${readableBUSD(busd, 2)}`)
    }).catch((err) => {
        console.log('MIN_INVEST_LIMIT', err);
    });

    
    contract.methods.userCount().call().then(userCount => {
        $("#total-players").html(userCount);
    }).catch((err) => {
        console.log('getUserCount', err);
    });
    
    tokenContract.methods.getCirculatingSupply().call().then(busd => {
        supply = busd;
        $("#circulating").html(`${readableBUSD(busd, 2)}`)
    }).catch((err) => {
        console.log('circulating', err);
    });

    tokenContract.methods.balanceOf(deadAddress).call().then(userBalance => {
        let amt = web3.utils.fromWei(userBalance);
        usrBal = userBalance;
        $('#burned').html(roundNum(amt))
        // calcNumTokens(roundNum(amt)).then(usdValue => {
        //     $('#user-balance-usd').html(roundNum(usdValue))
        // })
    }).catch((err) => {
        console.log('balanceOf', err)
    });

    

    if (started) {
        contract.methods.getBalance().call().then(balance => {
            contractBalance = balance;
            var amt = web3.utils.fromWei(balance);
            $('#contract-balance').html(roundNum(amt));
            // var usd = Number(priceInUSD*amt).toFixed(2);
            // $("#contract-balance-usd").html(usd)
        }).catch((err) => {
            console.log(err);
        });

        contract.methods.getSiteInfo().call().then(result => {
            var staked = web3.utils.fromWei(result._totalStaked);
            $('').html(roundNum(staked));	
            //$('#total-staked').html(staked);
            // var stakedUSD = Number(priceInUSD*staked).toFixed(2);
            // $("#total-staked-usd").html(stakedUSD)
            
            var ref = result._totalRefBonus;
            if (ref > 0) {
                var refBUSD = readableBUSD(ref, 2);
                $("#total-ref").html(refBUSD);
                // var refUSD = Number(priceInUSD*refBUSD).toFixed(2);
                // $('#total-ref-usd').html(refUSD)
            }

            

        }).catch((err) => {
            console.log('getSiteInfo', err);
        });
    }

    // web3.eth.getBalance(currentAddr).then(userBalance => {
    //     usrBal = userBalance;
    //     var amt = web3.utils.fromWei(userBalance);
    //     $("#user-balance").html(roundNum(amt));
    //     var usd = Number(priceInUSD*amt).toFixed(2);
    //     $("#user-balance-usd").html(usd)
    // }).catch((err) => {
    //     console.log(err);
    // });
	
    if(!currentAddr) {
        console.log('check if user is logged in');
        web3.eth.getAccounts(function(err, accounts){
            if (err != null) {
                console.error("An error occurred: "+err);
        }
            else if (accounts.length == 0) {
                console.log("User is not logged in to MetaMask");
            }
            else {console.log("User is logged in to MetaMask");
            loginActions(accounts);}
        });
        return;
    } else {
        tokenContract.methods.balanceOf(currentAddr).call().then(userBalance => {
            let amt = web3.utils.fromWei(userBalance);
            usrBal = userBalance;
            $('#user-balance').html(roundNum(amt))
            // calcNumTokens(roundNum(amt)).then(usdValue => {
            //     $('#user-balance-usd').html(roundNum(usdValue))
            // })
        }).catch((err) => {
            console.log('balanceOf', err)
        });

        tokenContract.methods.allowance(currentAddr, fountainAddress).call().then(result => {
            spend = web3.utils.fromWei(result)
            if (spend > 0 && started) {
                $('#user-approved-spend').html(roundNum(spend));
                // calcNumTokens(spend).then(usdValue => {
                //     $('#user-approved-spend-usd').html(usdValue)
                // })
                $("#buy-eggs-btn").attr('disabled', false);
                $("#busd-spend").attr('hidden', false);
                $("#busd-spend").attr('value', "100");
            }
        }).catch((err) => {
            console.log('allowance', err)
        });

        contract.methods.getUserInfo(currentAddr).call().then(user => {
            var initialDeposit = user._initialDeposit;
            var userDeposit = user._userDeposit;            
            var totalWithdrawn = user._totalWithdrawn;            
            var referrals = user._referrals;
            var refuser = user._referrer;
            var referralReward = user._referralReward;          
            var lastWithdrawTime = user._lastDepositTime;
            console.log('last withdraw time = ' + lastWithdrawTime)

            var now = new Date().getTime() / 1000;

            setInitialDeposit(initialDeposit);
            setTotalDeposit(userDeposit);
            setTotalWithdrawn(totalWithdrawn);
            setReferralReward(referralReward);
            setReferrals(referrals);
            setRef(refuser);

        }).catch((err) => {
            console.log('getUserInfo', err);
        });

        contract.methods.getAvailableEarnings(currentAddr).call().then(function (earnings) {
            var busdMined = readableBUSD(earnings, 4)
            $("#mined").html(busdMined);
            // var minedUsd = Number(priceInUSD*busdMined).toFixed(2);
            // $('#mined-usd').html(minedUsd)
        }).catch((err) => {
            console.log('getAvailableEarnings', err);
            throw err;
        });
    

    }
    
    console.log('Done refreshing data...')
}

function copyRef() {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('#reflink').text()).select();
    document.execCommand("copy");
    $temp.remove();
    $("#copied").html("<i class='ri-checkbox-circle-line'> copied!</i>").fadeOut('10000ms')
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}

function setInitialDeposit(initialDeposit) {
    totalDeposits = initialDeposit;
    var initialBUSD = readableBUSD(initialDeposit, 2);
    // var initialUSD = Number(priceInUSD*initialBUSD).toFixed(2);
    $("#initial-deposit").html(initialBUSD);
    // $("#initial-deposit-usd").html(initialUSD);
}

function setTotalDeposit(totalDeposit) {
    var totalBUSD = readableBUSD(totalDeposit, 2);
    // var totalUSD = Number(priceInUSD*totalBUSD).toFixed(2);
    $("#total-deposit").html(totalBUSD);
    // $("#total-deposit-usd").html(totalUSD);
}

function setTotalWithdrawn(totalWithdrawn) {
    var totalBUSD = readableBUSD(totalWithdrawn, 2);
    // var totalUSD = Number(priceInUSD*totalBUSD).toFixed(2);
    $("#total-withdrawn").html(totalBUSD);
    // $("#total-withdrawn-usd").html(totalUSD);
}

function setReferralReward(referralReward) {
    var totalBUSD = readableBUSD(referralReward, 2);
    // var totalUSD = Number(priceInUSD*totalBUSD).toFixed(2);
    $("#referral-Reward").html(totalBUSD);
    // $("#total-withdrawn-usd").html(totalUSD);
}

function setReferrals(referrals) {
    var totalBUSD = readableBUSD(referrals, 2);
    // var totalUSD = Number(priceInUSD*totalBUSD).toFixed(2);
    $("#ref-count").html(referrals);
    // $("#total-withdrawn-usd").html(totalUSD);
}

function setRef(refuser) {
    var referrerElement = document.getElementById('referrer-address');
    
    if (referrerElement) {
        // Ensure refuser is at least 9 characters long to avoid errors
        if (refuser.length > 9) {
            // Extract the first 5 and last 4 characters
            var firstPart = refuser.substring(0, 5);
            var lastPart = refuser.slice(-4);

            // Construct the displayed address
            referrerElement.textContent = `${firstPart}...${lastPart}`;
        } else {
            // If the address is too short, display it as is
            referrerElement.textContent = refuser;
        }
    } else {
        console.error('Referrer element not found');
    }

    // Optional: You can also log it to the console or perform other actions
    console.log('Referrer Address Set:', refuser);
}



function approveRef(newReferrer) {
    var newReferrer = document.getElementById("new-referrer-address").value.trim();

    if (newReferrer === "") {
        alert("Please enter a valid wallet address");
        return;
    }

    // Assuming you have a Web3 instance and contract methods set up
    contract.methods.changeReferrer(newReferrer).send({ from: currentAddr }).then(result => {
        refreshData()
    }).catch((err) => {
    console.log(err)
    });
    setTimeout(function(){
            
    },10000);
    
    console.log('Settle Down Ape...')
    
}


var startTimeInterval;
function setStartTimer() {
    var endDate = new Date().getTime();

    clearInterval(startTimeInterval)
    startTimeInterval = setInterval(function() {
        var currTime = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = endDate - currTime;
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	
	if (days < 10) { days = '0' + days; }
        if (hours < 10) { hours = '0' + hours; }
        if (minutes < 10) { minutes = '0' + minutes; }
        if (seconds < 10) { seconds = '0' + seconds; }

        $("#start-timer").html(`${days}d:${hours}h:${minutes}m:${seconds}s`);

        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(startTimeInterval);
            $("#start-container").remove();
            
            started = true;
            refreshData()
        }
    }, 1000, 1);
}



function approve(_amount) {
    let amt;
    if (_amount != 0) {
        amt = +spend + +_amount;
    }
    else {
        amt = 0
    }
    let _spend = web3.utils.toWei(amt.toString())
    tokenContract.methods.approve(fountainAddress, _spend).send({ from: currentAddr }).then(result => {
        if (result) {
            $('#busd-spend').attr('disabled', false);
            $('#buy-eggs-btn').attr('disabled', false);
            $('#buy-eggs-btn').attr('value', "100");
            refreshData();
        }

    }).catch((err)=> {
        console.log(err)
    });
}

function approveToken() {
    let spendDoc = document.getElementById("approve-spend");
    let _amount = spendDoc.value;
    approve(_amount);
}


function depositToken(){ 
    var spendDoc = document.getElementById('busd-spend')
    var busd = spendDoc.value;
	
    var amt = web3.utils.toWei(busd);
	if(+amt < +minDeposit) {
		alert(`you cannot deposit less than ${readableBUSD(minDeposit, 2)} Bananas`);
        return
    }
	
	var amt = web3.utils.toWei(busd);
	if(+amt + +totalDeposits > +maxDeposit) {
		alert(`you cannot deposit more than ${readableBUSD(maxDeposit, 2)} Bananas`);
        return
    }
	
    if(+amt > usrBal) {
		alert("you do not have " + busd + " Bananas in your wallet");
        return
    }
    if (+spend < +busd) {
        var amtToSpend = busd - spend;
        alert("you first need to approve " + amtToSpend + " Bananas before depositing");
        return
    }

    let ref = getQueryVariable('ref');
    if (busd > 0) {
        if (!web3.utils.isAddress(ref)) { ref = currentAddr }
        contract.methods.deposit(amt , ref).send({ from: currentAddr }).then(result => {
            refreshData()
        }).catch((err) => {
            console.log(err)
        });
    }
}

function roll(){
       
    contract.methods.compound().send({ from: currentAddr}).then(result => {
    refreshData()
    }).catch((err) => {
    console.log(err)
    });
    setTimeout(function(){
            
    },10000);
    
    console.log('Settle Down Ape...')
    
}

function sellToken(){
       
    contract.methods.withdraw().send({ from: currentAddr }).then(result => {
    refreshData()
    }).catch((err) => {
    console.log(err)
    });
    setTimeout(function(){
           
    },10000);
    
    console.log('Why Are You In Such A Rush...')
    
}

function getBalance(callback){
    contract.methods.getBalance().call().then(result => {
        callback(result);
    }).catch((err) => {
        console.log(err)
    });
}

function tokenPrice(callback) {
	const url = "";
	httpGetAsync(url,callback);
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.reBUSDnseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

function readableBUSD(amount, decimals) {
  return (amount / 1e18).toFixed(decimals);
}
