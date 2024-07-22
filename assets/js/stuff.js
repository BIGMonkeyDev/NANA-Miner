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

const networkChainId = 369;

var contract;
var tokenContract;
var wplsContract;
var daiContract;
var factoryv1Contract;
var factoryv2Contract;
var routerv1Contract;
var routerv2Contract;

const deadAddress = '0x000000000000000000000000000000000000dEaD';
const fountainAddress = '0xd8291a971182eE4363Fa708e8006424F586CaCB4'; //mainnet contract   
const FARM_TOKEN_ADDRESS = '0x34E76FA9cd853D185DfDB4770F96A059F328E5C0'; //project Token
const NATIVE_TOKEN_ADDRESS = "0xA1077a294dDE1B09bB078844df40758a5D0f9a27"; // Main Blockchain Token
const STABLECOIN_ADDRESS = "0xefD766cCb38EaF1dfd701853BFCe31359239F305"; // Mian Stable Coin
const PULSEX_V1_ROUTER_ADDRESS = "0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02";
const PULSEX_V2_ROUTER_ADDRESS = "0x165C3410fC91EF562C50559f7d2289fEbed552d9";
const PULSEX_V1_FACTORY_ADDRESS = "0x1715a3E4A142d8b698131108995174F37aEBA10D";
const PULSEX_V2_FACTORY_ADDRESS = "0x29ea7545def87022badc76323f373ea1e707c523";
const FACTORY_PAIR = "0x146E1f1e060e5b5016Db0D118D2C5a11A240ae32"; //Main Blockchain LP

const Oracles = {
    PULSEX_V1: 0,
    PULSEX_V2: 1,
    
}

var started = true;
var canSell = true;

const tokenAbi = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getCirculatingSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ]

const fountainAbi = [ { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "authorize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newGrowth", "type": "address" } ], "name": "changeGrowth", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newReferrer", "type": "address" } ], "name": "changeReferrer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newTrash", "type": "address" } ], "name": "changeTrash", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "compound", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "address", "name": "ref", "type": "address" } ], "name": "deposit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "newPercent", "type": "uint256" } ], "name": "newDaily", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "newMIN", "type": "uint256" } ], "name": "newMinInvest", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "referrer", "type": "address" }, { "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "reason", "type": "string" } ], "name": "ReferralRewardSkipped", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "wallet", "type": "address" }, { "internalType": "bool", "name": "status", "type": "bool" } ], "name": "setBlacklist", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address payable", "name": "adr", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "unauthorize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "blacklistActive", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "blacklisted", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "_initialDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "_userDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "_lastDepositTime", "type": "uint256" }, { "internalType": "uint256", "name": "_totalWithdrawn", "type": "uint256" } ], "name": "calculateInterest", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "COMPOUND_TAX", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "contractStarted", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DAILY_INTEREST", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "DEPOSIT_TAX", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "farmToken", "outputs": [ { "internalType": "contract FarmToken", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "userAddress", "type": "address" } ], "name": "getAvailableEarnings", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getBalance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getSiteInfo", "outputs": [ { "internalType": "uint256", "name": "_totalStaked", "type": "uint256" }, { "internalType": "uint256", "name": "_totalUsers", "type": "uint256" }, { "internalType": "uint256", "name": "_totalRefBonus", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_adr", "type": "address" } ], "name": "getUserInfo", "outputs": [ { "internalType": "uint256", "name": "_initialDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "_userDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "_referralReward", "type": "uint256" }, { "internalType": "uint256", "name": "_lastDepositTime", "type": "uint256" }, { "internalType": "uint256", "name": "_totalWithdrawn", "type": "uint256" }, { "internalType": "address", "name": "_referrer", "type": "address" }, { "internalType": "uint256", "name": "_referrals", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "IRS_TAX_LEVEL_1", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "IRS_TAX_LEVEL_2", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "IRS_TAX_LEVEL_3", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "IRS_TAX_LEVEL_4", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "adr", "type": "address" } ], "name": "isAuthorized", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "isOwner", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MAX_PAYOUT_MULTIPLIER", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MIN_INVEST_LIMIT", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MIN_REF_TOKEN_AMOUNT", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "PERCENTS_DIVIDER", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "REFERRAL", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "refToken", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalRefBonus", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalStaked", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalUsers", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalWithdrawn", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "userCount", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "users", "outputs": [ { "internalType": "uint256", "name": "initialDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "userDeposit", "type": "uint256" }, { "internalType": "uint256", "name": "lastDepositTime", "type": "uint256" }, { "internalType": "uint256", "name": "totalWithdrawn", "type": "uint256" }, { "internalType": "address", "name": "referrer", "type": "address" }, { "internalType": "uint256", "name": "referrals", "type": "uint256" }, { "internalType": "uint256", "name": "referralReward", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WALLET_DEPOSIT_LIMIT", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WITHDRAWAL_TAX", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ]

const routerAbi = [{"type":"constructor","inputs":[{"type":"address","name":"_factory","internalType":"address"},{"type":"address","name":"_WPLS","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"WPLS","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"amountA","internalType":"uint256"},{"type":"uint256","name":"amountB","internalType":"uint256"},{"type":"uint256","name":"liquidity","internalType":"uint256"}],"name":"addLiquidity","inputs":[{"type":"address","name":"tokenA","internalType":"address"},{"type":"address","name":"tokenB","internalType":"address"},{"type":"uint256","name":"amountADesired","internalType":"uint256"},{"type":"uint256","name":"amountBDesired","internalType":"uint256"},{"type":"uint256","name":"amountAMin","internalType":"uint256"},{"type":"uint256","name":"amountBMin","internalType":"uint256"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"function","stateMutability":"payable","outputs":[{"type":"uint256","name":"amountToken","internalType":"uint256"},{"type":"uint256","name":"amountETH","internalType":"uint256"},{"type":"uint256","name":"liquidity","internalType":"uint256"}],"name":"addLiquidityETH","inputs":[{"type":"address","name":"token","internalType":"address"},{"type":"uint256","name":"amountTokenDesired","internalType":"uint256"},{"type":"uint256","name":"amountTokenMin","internalType":"uint256"},{"type":"uint256","name":"amountETHMin","internalType":"uint256"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"factory","inputs":[]},{"type":"function","stateMutability":"pure","outputs":[{"type":"uint256","name":"amountIn","internalType":"uint256"}],"name":"getAmountIn","inputs":[{"type":"uint256","name":"amountOut","internalType":"uint256"},{"type":"uint256","name":"reserveIn","internalType":"uint256"},{"type":"uint256","name":"reserveOut","internalType":"uint256"}]},{"type":"function","stateMutability":"pure","outputs":[{"type":"uint256","name":"amountOut","internalType":"uint256"}],"name":"getAmountOut","inputs":[{"type":"uint256","name":"amountIn","internalType":"uint256"},{"type":"uint256","name":"reserveIn","internalType":"uint256"},{"type":"uint256","name":"reserveOut","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256[]","name":"amounts","internalType":"uint256[]"}],"name":"getAmountsIn","inputs":[{"type":"uint256","name":"amountOut","internalType":"uint256"},{"type":"address[]","name":"path","internalType":"address[]"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256[]","name":"amounts","internalType":"uint256[]"}],"name":"getAmountsOut","inputs":[{"type":"uint256","name":"amountIn","internalType":"uint256"},{"type":"address[]","name":"path","internalType":"address[]"}]},{"type":"function","stateMutability":"pure","outputs":[{"type":"uint256","name":"amountB","internalType":"uint256"}],"name":"quote","inputs":[{"type":"uint256","name":"amountA","internalType":"uint256"},{"type":"uint256","name":"reserveA","internalType":"uint256"},{"type":"uint256","name":"reserveB","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"amountA","internalType":"uint256"},{"type":"uint256","name":"amountB","internalType":"uint256"}],"name":"removeLiquidity","inputs":[{"type":"address","name":"tokenA","internalType":"address"},{"type":"address","name":"tokenB","internalType":"address"},{"type":"uint256","name":"liquidity","internalType":"uint256"},{"type":"uint256","name":"amountAMin","internalType":"uint256"},{"type":"uint256","name":"amountBMin","internalType":"uint256"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"amountToken","internalType":"uint256"},{"type":"uint256","name":"amountETH","internalType":"uint256"}],"name":"removeLiquidityETH","inputs":[{"type":"address","name":"token","internalType":"address"},{"type":"uint256","name":"liquidity","internalType":"uint256"},{"type":"uint256","name":"amountTokenMin","internalType":"uint256"},{"type":"uint256","name":"amountETHMin","internalType":"uint256"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"amountETH","internalType":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","inputs":[{"type":"address","name":"token","internalType":"address"},{"type":"uint256","name":"liquidity","internalType":"uint256"},{"type":"uint256","name":"amountTokenMin","internalType":"uint256"},{"type":"uint256","name":"amountETHMin","internalType":"uint256"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"amountToken","internalType":"uint256"},{"type":"uint256","name":"amountETH","internalType":"uint256"}],"name":"removeLiquidityETHWithPermit","inputs":[{"type":"address","name":"token","internalType":"address"},{"type":"uint256","name":"liquidity","internalType":"uint256"},{"type":"uint256","name":"amountTokenMin","internalType":"uint256"},{"type":"uint256","name":"amountETHMin","internalType":"uint256"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"},{"type":"bool","name":"approveMax","internalType":"bool"},{"type":"uint8","name":"v","internalType":"uint8"},{"type":"bytes32","name":"r","internalType":"bytes32"},{"type":"bytes32","name":"s","internalType":"bytes32"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"amountETH","internalType":"uint256"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","inputs":[{"type":"address","name":"token","internalType":"address"},{"type":"uint256","name":"liquidity","internalType":"uint256"},{"type":"uint256","name":"amountTokenMin","internalType":"uint256"},{"type":"uint256","name":"amountETHMin","internalType":"uint256"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"},{"type":"bool","name":"approveMax","internalType":"bool"},{"type":"uint8","name":"v","internalType":"uint8"},{"type":"bytes32","name":"r","internalType":"bytes32"},{"type":"bytes32","name":"s","internalType":"bytes32"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256","name":"amountA","internalType":"uint256"},{"type":"uint256","name":"amountB","internalType":"uint256"}],"name":"removeLiquidityWithPermit","inputs":[{"type":"address","name":"tokenA","internalType":"address"},{"type":"address","name":"tokenB","internalType":"address"},{"type":"uint256","name":"liquidity","internalType":"uint256"},{"type":"uint256","name":"amountAMin","internalType":"uint256"},{"type":"uint256","name":"amountBMin","internalType":"uint256"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"},{"type":"bool","name":"approveMax","internalType":"bool"},{"type":"uint8","name":"v","internalType":"uint8"},{"type":"bytes32","name":"r","internalType":"bytes32"},{"type":"bytes32","name":"s","internalType":"bytes32"}]},{"type":"function","stateMutability":"payable","outputs":[{"type":"uint256[]","name":"amounts","internalType":"uint256[]"}],"name":"swapETHForExactTokens","inputs":[{"type":"uint256","name":"amountOut","internalType":"uint256"},{"type":"address[]","name":"path","internalType":"address[]"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"function","stateMutability":"payable","outputs":[{"type":"uint256[]","name":"amounts","internalType":"uint256[]"}],"name":"swapExactETHForTokens","inputs":[{"type":"uint256","name":"amountOutMin","internalType":"uint256"},{"type":"address[]","name":"path","internalType":"address[]"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"function","stateMutability":"payable","outputs":[],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","inputs":[{"type":"uint256","name":"amountOutMin","internalType":"uint256"},{"type":"address[]","name":"path","internalType":"address[]"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256[]","name":"amounts","internalType":"uint256[]"}],"name":"swapExactTokensForETH","inputs":[{"type":"uint256","name":"amountIn","internalType":"uint256"},{"type":"uint256","name":"amountOutMin","internalType":"uint256"},{"type":"address[]","name":"path","internalType":"address[]"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","inputs":[{"type":"uint256","name":"amountIn","internalType":"uint256"},{"type":"uint256","name":"amountOutMin","internalType":"uint256"},{"type":"address[]","name":"path","internalType":"address[]"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256[]","name":"amounts","internalType":"uint256[]"}],"name":"swapExactTokensForTokens","inputs":[{"type":"uint256","name":"amountIn","internalType":"uint256"},{"type":"uint256","name":"amountOutMin","internalType":"uint256"},{"type":"address[]","name":"path","internalType":"address[]"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","inputs":[{"type":"uint256","name":"amountIn","internalType":"uint256"},{"type":"uint256","name":"amountOutMin","internalType":"uint256"},{"type":"address[]","name":"path","internalType":"address[]"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256[]","name":"amounts","internalType":"uint256[]"}],"name":"swapTokensForExactETH","inputs":[{"type":"uint256","name":"amountOut","internalType":"uint256"},{"type":"uint256","name":"amountInMax","internalType":"uint256"},{"type":"address[]","name":"path","internalType":"address[]"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"uint256[]","name":"amounts","internalType":"uint256[]"}],"name":"swapTokensForExactTokens","inputs":[{"type":"uint256","name":"amountOut","internalType":"uint256"},{"type":"uint256","name":"amountInMax","internalType":"uint256"},{"type":"address[]","name":"path","internalType":"address[]"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"deadline","internalType":"uint256"}]},{"type":"receive"}]

const factoryAbi = [{"type":"constructor","inputs":[{"type":"address","name":"_feeToSetter","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bytes32","name":"","internalType":"bytes32"}],"name":"INIT_CODE_PAIR_HASH","inputs":[],"constant":true},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"allPairs","inputs":[{"type":"uint256","name":"","internalType":"uint256"}],"constant":true},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"allPairsLength","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"address","name":"pair","internalType":"address"}],"name":"createPair","inputs":[{"type":"address","name":"tokenA","internalType":"address"},{"type":"address","name":"tokenB","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"feeTo","inputs":[],"constant":true},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"feeToSetter","inputs":[],"constant":true},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"getPair","inputs":[{"type":"address","name":"","internalType":"address"},{"type":"address","name":"","internalType":"address"}],"constant":true},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setFeeTo","inputs":[{"type":"address","name":"_feeTo","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setFeeToSetter","inputs":[{"type":"address","name":"_feeToSetter","internalType":"address"}],"constant":false},{"type":"event","name":"PairCreated","inputs":[{"type":"address","name":"token0","indexed":true},{"type":"address","name":"token1","indexed":true},{"type":"address","name":"pair","indexed":false},{"type":"uint256","name":"","indexed":false}],"anonymous":false}]

const factoryPair = [{"type":"constructor","stateMutability":"nonpayable","payable":false,"inputs":[]},{"type":"event","name":"Approval","inputs":[{"type":"address","name":"owner","internalType":"address","indexed":true},{"type":"address","name":"spender","internalType":"address","indexed":true},{"type":"uint256","name":"value","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"Burn","inputs":[{"type":"address","name":"sender","internalType":"address","indexed":true},{"type":"uint256","name":"amount0","internalType":"uint256","indexed":false},{"type":"uint256","name":"amount1","internalType":"uint256","indexed":false},{"type":"address","name":"to","internalType":"address","indexed":true},{"type":"address","name":"senderOrigin","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"Mint","inputs":[{"type":"address","name":"sender","internalType":"address","indexed":true},{"type":"uint256","name":"amount0","internalType":"uint256","indexed":false},{"type":"uint256","name":"amount1","internalType":"uint256","indexed":false},{"type":"address","name":"senderOrigin","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"Swap","inputs":[{"type":"address","name":"sender","internalType":"address","indexed":true},{"type":"uint256","name":"amount0In","internalType":"uint256","indexed":false},{"type":"uint256","name":"amount1In","internalType":"uint256","indexed":false},{"type":"uint256","name":"amount0Out","internalType":"uint256","indexed":false},{"type":"uint256","name":"amount1Out","internalType":"uint256","indexed":false},{"type":"address","name":"to","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"Sync","inputs":[{"type":"uint112","name":"reserve0","internalType":"uint112","indexed":false},{"type":"uint112","name":"reserve1","internalType":"uint112","indexed":false}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"type":"address","name":"from","internalType":"address","indexed":true},{"type":"address","name":"to","internalType":"address","indexed":true},{"type":"uint256","name":"value","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"bytes32","name":"","internalType":"bytes32"}],"name":"DOMAIN_SEPARATOR","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"MINIMUM_LIQUIDITY","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"bytes32","name":"","internalType":"bytes32"}],"name":"PERMIT_TYPEHASH","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"allowance","inputs":[{"type":"address","name":"","internalType":"address"},{"type":"address","name":"","internalType":"address"}],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"approve","inputs":[{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"value","internalType":"uint256"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"balanceOf","inputs":[{"type":"address","name":"","internalType":"address"}],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"uint256","name":"amount0","internalType":"uint256"},{"type":"uint256","name":"amount1","internalType":"uint256"}],"name":"burn","inputs":[{"type":"address","name":"to","internalType":"address"},{"type":"address","name":"senderOrigin","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint8","name":"","internalType":"uint8"}],"name":"decimals","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"address","name":"","internalType":"address"}],"name":"factory","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint112","name":"_reserve0","internalType":"uint112"},{"type":"uint112","name":"_reserve1","internalType":"uint112"},{"type":"uint32","name":"_blockTimestampLast","internalType":"uint32"}],"name":"getReserves","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"initialize","inputs":[{"type":"address","name":"_token0","internalType":"address"},{"type":"address","name":"_token1","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"kLast","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"uint256","name":"liquidity","internalType":"uint256"}],"name":"mint","inputs":[{"type":"address","name":"to","internalType":"address"},{"type":"address","name":"senderOrigin","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"string","name":"","internalType":"string"}],"name":"name","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"nonces","inputs":[{"type":"address","name":"","internalType":"address"}],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"permit","inputs":[{"type":"address","name":"owner","internalType":"address"},{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"value","internalType":"uint256"},{"type":"uint256","name":"deadline","internalType":"uint256"},{"type":"uint8","name":"v","internalType":"uint8"},{"type":"bytes32","name":"r","internalType":"bytes32"},{"type":"bytes32","name":"s","internalType":"bytes32"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"price0CumulativeLast","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"price1CumulativeLast","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"skim","inputs":[{"type":"address","name":"to","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"swap","inputs":[{"type":"uint256","name":"amount0Out","internalType":"uint256"},{"type":"uint256","name":"amount1Out","internalType":"uint256"},{"type":"address","name":"to","internalType":"address"},{"type":"bytes","name":"data","internalType":"bytes"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"string","name":"","internalType":"string"}],"name":"symbol","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"sync","inputs":[],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"address","name":"","internalType":"address"}],"name":"token0","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"address","name":"","internalType":"address"}],"name":"token1","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalSupply","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transfer","inputs":[{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"value","internalType":"uint256"}],"constant":false},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transferFrom","inputs":[{"type":"address","name":"from","internalType":"address"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"value","internalType":"uint256"}],"constant":false}]

const pairAbi = [{"type":"constructor","stateMutability":"nonpayable","payable":false,"inputs":[]},{"type":"event","name":"Approval","inputs":[{"type":"address","name":"owner","internalType":"address","indexed":true},{"type":"address","name":"spender","internalType":"address","indexed":true},{"type":"uint256","name":"value","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"Burn","inputs":[{"type":"address","name":"sender","internalType":"address","indexed":true},{"type":"uint256","name":"amount0","internalType":"uint256","indexed":false},{"type":"uint256","name":"amount1","internalType":"uint256","indexed":false},{"type":"address","name":"to","internalType":"address","indexed":true},{"type":"address","name":"senderOrigin","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"Mint","inputs":[{"type":"address","name":"sender","internalType":"address","indexed":true},{"type":"uint256","name":"amount0","internalType":"uint256","indexed":false},{"type":"uint256","name":"amount1","internalType":"uint256","indexed":false},{"type":"address","name":"senderOrigin","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"Swap","inputs":[{"type":"address","name":"sender","internalType":"address","indexed":true},{"type":"uint256","name":"amount0In","internalType":"uint256","indexed":false},{"type":"uint256","name":"amount1In","internalType":"uint256","indexed":false},{"type":"uint256","name":"amount0Out","internalType":"uint256","indexed":false},{"type":"uint256","name":"amount1Out","internalType":"uint256","indexed":false},{"type":"address","name":"to","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"Sync","inputs":[{"type":"uint112","name":"reserve0","internalType":"uint112","indexed":false},{"type":"uint112","name":"reserve1","internalType":"uint112","indexed":false}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"type":"address","name":"from","internalType":"address","indexed":true},{"type":"address","name":"to","internalType":"address","indexed":true},{"type":"uint256","name":"value","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"bytes32","name":"","internalType":"bytes32"}],"name":"DOMAIN_SEPARATOR","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"MINIMUM_LIQUIDITY","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"bytes32","name":"","internalType":"bytes32"}],"name":"PERMIT_TYPEHASH","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"allowance","inputs":[{"type":"address","name":"","internalType":"address"},{"type":"address","name":"","internalType":"address"}],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"approve","inputs":[{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"value","internalType":"uint256"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"balanceOf","inputs":[{"type":"address","name":"","internalType":"address"}],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"uint256","name":"amount0","internalType":"uint256"},{"type":"uint256","name":"amount1","internalType":"uint256"}],"name":"burn","inputs":[{"type":"address","name":"to","internalType":"address"},{"type":"address","name":"senderOrigin","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint8","name":"","internalType":"uint8"}],"name":"decimals","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"address","name":"","internalType":"address"}],"name":"factory","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint112","name":"_reserve0","internalType":"uint112"},{"type":"uint112","name":"_reserve1","internalType":"uint112"},{"type":"uint32","name":"_blockTimestampLast","internalType":"uint32"}],"name":"getReserves","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"initialize","inputs":[{"type":"address","name":"_token0","internalType":"address"},{"type":"address","name":"_token1","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"kLast","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"uint256","name":"liquidity","internalType":"uint256"}],"name":"mint","inputs":[{"type":"address","name":"to","internalType":"address"},{"type":"address","name":"senderOrigin","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"string","name":"","internalType":"string"}],"name":"name","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"nonces","inputs":[{"type":"address","name":"","internalType":"address"}],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"permit","inputs":[{"type":"address","name":"owner","internalType":"address"},{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"value","internalType":"uint256"},{"type":"uint256","name":"deadline","internalType":"uint256"},{"type":"uint8","name":"v","internalType":"uint8"},{"type":"bytes32","name":"r","internalType":"bytes32"},{"type":"bytes32","name":"s","internalType":"bytes32"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"price0CumulativeLast","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"price1CumulativeLast","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"skim","inputs":[{"type":"address","name":"to","internalType":"address"}],"constant":false},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"swap","inputs":[{"type":"uint256","name":"amount0Out","internalType":"uint256"},{"type":"uint256","name":"amount1Out","internalType":"uint256"},{"type":"address","name":"to","internalType":"address"},{"type":"bytes","name":"data","internalType":"bytes"}],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"string","name":"","internalType":"string"}],"name":"symbol","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[],"name":"sync","inputs":[],"constant":false},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"address","name":"","internalType":"address"}],"name":"token0","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"address","name":"","internalType":"address"}],"name":"token1","inputs":[],"constant":true},{"type":"function","stateMutability":"view","payable":false,"outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalSupply","inputs":[],"constant":true},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transfer","inputs":[{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"value","internalType":"uint256"}],"constant":false},{"type":"function","stateMutability":"nonpayable","payable":false,"outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transferFrom","inputs":[{"type":"address","name":"from","internalType":"address"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"value","internalType":"uint256"}],"constant":false}]

// ------ contract calls
function loadContracts() {
    console.log('Loading contracts...')
    web3 = window.web3
    contract = new web3.eth.Contract(fountainAbi, fountainAddress);
    tokenContract = new web3.eth.Contract(tokenAbi, FARM_TOKEN_ADDRESS);
    wplsContract = new web3.eth.Contract(tokenAbi, NATIVE_TOKEN_ADDRESS);
    daiContract = new web3.eth.Contract(tokenAbi, STABLECOIN_ADDRESS);
    routerv1Contract = new web3.eth.Contract(routerAbi, PULSEX_V1_ROUTER_ADDRESS);
    routerv2Contract = new web3.eth.Contract(routerAbi, PULSEX_V2_ROUTER_ADDRESS);
    factoryv1Contract = new web3.eth.Contract(factoryAbi, PULSEX_V1_FACTORY_ADDRESS);
    factoryv2Contract = new web3.eth.Contract(factoryAbi, PULSEX_V2_FACTORY_ADDRESS);

    
    

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
             var minedUsd = Number(priceInUSD*busdMined).toFixed(2);
             $('#token-price').html(minedUsd)
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

// Utility function to convert amount from wei to a readable format
function readableBUSD(amount, decimals = 18) {
    return (amount / 1e18).toFixed(decimals);
}

// Constants for Oracle Types
const Oracles = {
    PULSEX_V1: 'PULSEX_V1',
    PULSEX_V2: 'PULSEX_V2'
};

// Replace with your contract instances
const Factory = {
    getReservesFromTokens: async (factoryAddress, token0, token1) => {
        // Replace with actual implementation
    }
};

const Router = {
    quote: async (routerAddress, amount, reserve0, reserve1) => {
        // Replace with actual implementation
    }
};

const FactoryPair = {
    getReserves: async (pairAddress) => {
        // Replace with actual implementation
    },
    token0: async (pairAddress) => {
        // Replace with actual implementation
    },
    token1: async (pairAddress) => {
        // Replace with actual implementation
    }
};

const erc20 = {
    totalSupply: async (tokenAddress) => {
        // Replace with actual implementation
    }
};

// Fetch token price
const tokenPrice = async (token, oracle) => {
    if (oracle === Oracles.PULSEX_V1) {
        try {
            let reserves = await Factory.getReservesFromTokens(PULSEX_V1_FACTORY_ADDRESS, token, NATIVE_TOKEN_ADDRESS);
            let quote = await Router.quote(PULSEX_V1_ROUTER_ADDRESS, parseEther('1'), reserves[0], reserves[1]);
            return quote;
        } catch (error) {
            console.log('Error fetching price using oracle PULSEX_V1');
        }
    } else if (oracle === Oracles.PULSEX_V2) {
        try {
            let reserves = await Factory.getReservesFromTokens(PULSEX_V2_FACTORY_ADDRESS, token, NATIVE_TOKEN_ADDRESS);
            let quote = await Router.quote(PULSEX_V2_ROUTER_ADDRESS, parseEther('1'), reserves[0], reserves[1]);
            return quote;
        } catch (error) {
            console.log('Error fetching price using oracle PULSEX_V2');
        }
    }
};

// Fetch USD value
const toUsd = async (amount) => {
    try {
        let reserves = await Factory.getReservesFromTokens(PULSEX_V1_FACTORY_ADDRESS, NATIVE_TOKEN_ADDRESS, STABLECOIN_ADDRESS);
        let quote = await Router.quote(PULSEX_V1_ROUTER_ADDRESS, amount, reserves[0], reserves[1]);
        return readableBUSD(quote, 18); // Assuming 18 decimals for USD
    } catch (e) {
        console.log('Error fetching USD value');
    }
};

// Fetch farm token price
const farmTokenPrice = async () => {
    try {
        let reserves = await Factory.getReservesFromTokens(PULSEX_V2_FACTORY_ADDRESS, FARM_TOKEN_ADDRESS, NATIVE_TOKEN_ADDRESS);
        let quote = await Router.quote(PULSEX_V2_ROUTER_ADDRESS, parseEther('1'), reserves[0], reserves[1]);
        return quote;
    } catch (e) {
        console.log('Error fetching farm token price');
    }
};

// Calculate pair value
const calculatePairValue = async (pairToken, amount, oracle) => {
    if (amount > 0) {
        if (oracle === Oracles.PULSEX_V1) {
            try {
                let totalValueLocked;

                let reserves = await FactoryPair.getReserves(pairToken);
                let totalSupplyLP = await erc20.totalSupply(pairToken);
                let token0 = await FactoryPair.token0(pairToken);
                let token1 = await FactoryPair.token1(pairToken);

                let amountToken0 = reserves[0] * amount / totalSupplyLP;
                let amountToken1 = reserves[1] * amount / totalSupplyLP;

                if (token0 === NATIVE_TOKEN_ADDRESS) {
                    let tokenOneToNative = await Router.quote(PULSEX_V1_ROUTER_ADDRESS, amountToken1, reserves[1], reserves[0]);
                    totalValueLocked = amountToken0 + tokenOneToNative;
                } else if (token1 === NATIVE_TOKEN_ADDRESS) {
                    let tokenZeroToNative = await Router.quote(PULSEX_V1_ROUTER_ADDRESS, amountToken0, reserves[0], reserves[1]);
                    totalValueLocked = amountToken1 + tokenZeroToNative;
                } else {
                    let [reservesNative0, reserves0] = await Factory.getReservesFromTokens(PULSEX_V1_FACTORY_ADDRESS, NATIVE_TOKEN_ADDRESS, token0);
                    let [reservesNative1, reserves1] = await Factory.getReservesFromTokens(PULSEX_V1_FACTORY_ADDRESS, NATIVE_TOKEN_ADDRESS, token1);
                    let tokenZeroToNative = await Router.quote(PULSEX_V1_ROUTER_ADDRESS, amountToken0, reserves0, reservesNative0);
                    let tokenOneToNative = await Router.quote(PULSEX_V1_ROUTER_ADDRESS, amountToken1, reserves1, reservesNative1);

                    totalValueLocked = tokenZeroToNative + tokenOneToNative;
                }

                return totalValueLocked;
            } catch (error) {
                console.log(error);
            }
        } else if (oracle === Oracles.PULSEX_V2) {
            try {
                let totalValueLocked;

                let reserves = await FactoryPair.getReserves(pairToken);
                let totalSupplyLP = await erc20.totalSupply(pairToken);
                let token0 = await FactoryPair.token0(pairToken);
                let token1 = await FactoryPair.token1(pairToken);

                let amountToken0 = reserves[0] * amount / totalSupplyLP;
                let amountToken1 = reserves[1] * amount / totalSupplyLP;

                if (token0 === NATIVE_TOKEN_ADDRESS) {
                    let tokenOneToNative = await Router.quote(PULSEX_V2_ROUTER_ADDRESS, amountToken1, reserves[1], reserves[0]);
                    totalValueLocked = amountToken0 + tokenOneToNative;
                } else if (token1 === NATIVE_TOKEN_ADDRESS) {
                    let tokenZeroToNative = await Router.quote(PULSEX_V2_ROUTER_ADDRESS, amountToken0, reserves[0], reserves[1]);
                    totalValueLocked = amountToken1 + tokenZeroToNative;
                } else {
                    let [reservesNative0, reserves0] = await Factory.getReservesFromTokens(PULSEX_V2_FACTORY_ADDRESS, NATIVE_TOKEN_ADDRESS, token0);
                    let [reservesNative1, reserves1] = await Factory.getReservesFromTokens(PULSEX_V2_FACTORY_ADDRESS, NATIVE_TOKEN_ADDRESS, token1);
                    let tokenZeroToNative = await Router.quote(PULSEX_V2_ROUTER_ADDRESS, amountToken0, reserves0, reservesNative0);
                    let tokenOneToNative = await Router.quote(PULSEX_V2_ROUTER_ADDRESS, amountToken1, reserves1, reservesNative1);

                    totalValueLocked = tokenZeroToNative + tokenOneToNative;
                }

                return totalValueLocked;
            } catch (error) {
                console.log(error);
            }
        }
    }
}