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


const fountainAddress = '0x75f81037De6efbE73de0a8F102764a7F95eAE772'; //mainnet contract   
const tokenAddress = '0xda0F4E3A170019f21728a8168A7236E8c0460f42'; //mainnet Token

var tokenContract;
var started = true;
var canSell = true;

const tokenAbi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]

const fountainAbi = [ { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "authorize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newGrowth", "type": "address" } ], "name": "changeGrowth", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newReferrer", "type": "address" } ], "name": "changeReferrer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newTrash", "type": "address" } ], "name": "changeTrash", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "compound", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "address", "name": "ref", "type": "address" } ], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "newPercent", "type": "uint256" } ], "name": "newDaily", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "newMIN", "type": "uint256" } ], "name": "newMinInvest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "referrer", "type": "address" }, { "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "reason", "type": "string" } ], "name": "ReferralRewardSkipped", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "wallet", "type": "address" }, { "internalType": "bool", "name": "status", "type": "bool" } ], "name": "setBlacklist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "adr", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "unauthorize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "blacklistActive", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "blacklisted", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_initialDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "_userDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "_lastDepositTime", "type": "uint256" }, { "internalType": "uint256", "name": "_totalWithdrawn", "type": "uint256" } ], "name": "calculateInterest", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "COMPOUND_TAX", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "contractStarted", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DAILY_INTEREST", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DEPOSIT_TAX", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "userAddress", "type": "address" } ], "name": "getAvailableEarnings", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getBalance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getSiteInfo", "outputs": [ { "internalType": "uint256", "name": "_totalStaked", "type": "uint256" }, { "internalType": "uint256", "name": "_totalUsers", "type": "uint256" }, { "internalType": "uint256", "name": "_totalRefBonus", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_adr", "type": "address" } ], "name": "getUserInfo", "outputs": [ { "internalType": "uint256", "name": "_initialDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "_userDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "_referralReward", "type": "uint256" }, { "internalType": "uint256", "name": "_lastDepositTime", "type": "uint256" }, { "internalType": "uint256", "name": "_totalWithdrawn", "type": "uint256" }, { "internalType": "address", "name": "_referrer", "type": "address" }, { "internalType": "uint256", "name": "_referrals", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "IRS_TAX_LEVEL_1", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "IRS_TAX_LEVEL_2", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "IRS_TAX_LEVEL_3", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "IRS_TAX_LEVEL_4", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "isAuthorized", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isOwner", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MAX_PAYOUT_MULTIPLIER", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MIN_INVEST_LIMIT", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MIN_REF_TOKEN_AMOUNT", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "PERCENTS_DIVIDER", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REFERRAL", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "refToken", "outputs": [ { "internalType": "contract IToken", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token", "outputs": [ { "internalType": "contract IToken", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalRefBonus", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalStaked", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalUsers", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalWithdrawn", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "userCount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "users", "outputs": [ { "internalType": "uint256", "name": "initialDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "userDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "lastDepositTime", "type": "uint256" }, { "internalType": "uint256", "name": "totalWithdrawn", "type": "uint256" }, { "internalType": "address", "name": "referrer", "type": "address" }, { "internalType": "uint256", "name": "referrals", "type": "uint256" }, { "internalType": "uint256", "name": "referralReward", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WALLET_DEPOSIT_LIMIT", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WITHDRAWAL_TAX", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ]

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
            var referralReward = user._referralReward;          
            var lastWithdrawTime = user._lastDepositTime;
            console.log('last withdraw time = ' + lastWithdrawTime)

            var now = new Date().getTime() / 1000;

            setInitialDeposit(initialDeposit);
            setTotalDeposit(userDeposit);
            setTotalWithdrawn(totalWithdrawn);
            setReferralReward(referralReward);
            setReferrals(referrals);

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

function approveRef() {
    var newReferrerAddress = document.getElementById("new-referrer-address").value.trim();

    if (newReferrerAddress === "") {
        alert("Please enter a valid wallet address");
        return;
    }

    // Assuming you have a Web3 instance and contract methods set up
    contract.methods.changeReferrer(newReferrerAddress).send({ from: userWalletAddress })
        .on('transactionHash', function(hash){
            // Handle transaction hash event if needed
            console.log("Transaction Hash: ", hash);
        })
        .on('confirmation', function(confirmationNumber, receipt){
            // Handle confirmation event if needed
            console.log("Confirmation Number: ", confirmationNumber);
            console.log("Receipt: ", receipt);
            // Optionally update UI or show success message
        })
        .on('error', function(error, receipt) {
            // Handle error event
            console.error("Error: ", error);
            if (receipt) {
                console.error("Receipt: ", receipt);
            }
            // Optionally show error message to user
        });
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

function hatchEggs(){
       
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
