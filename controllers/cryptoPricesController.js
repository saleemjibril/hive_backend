import Episode from "../models/EpisodeModel.js";
import catchAsync from "../utils/catchAsync.js";


// Backend function to fetch crypto prices
export const getCryptoPrices = catchAsync(async (req, res, next) => {
  try {
    // Get symbols from query params or use default
    const { symbols } = req.query;
    const defaultSymbols = ['bitcoin', 'ethereum', 'binancecoin', 'cardano', 'solana', 'polkadot', 'chainlink', 'polygon', 'avalanche-2', 'uniswap'];
    const cryptoSymbols = symbols ? symbols.split(',') : defaultSymbols;
    
    const symbolsString = cryptoSymbols.join(',');
    
    // Fetch from CoinGecko API
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symbolsString}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
    );
    
    if (!response.ok) {
      return 'Failed to fetch crypto prices from CoinGecko';
    }
    
    const data = await response.json();
    
    // Transform data into array format
    const transformedData = cryptoSymbols.map(symbol => {
      const coinData = data[symbol];
      if (!coinData) return null;
      
      return {
        id: symbol,
        name: formatCoinName(symbol),
        symbol: getSymbolAbbr(symbol),
        price: coinData.usd,
        change24h: coinData.usd_24h_change || 0,
        marketCap: coinData.usd_market_cap
      };
    }).filter(Boolean);
    
    res.status(200).json({
      status: "success",
      data: {
        cryptoPrices: transformedData,
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return next(new AppError('Failed to fetch cryptocurrency prices', 500));
  }
});

// Helper function to format coin names
const formatCoinName = (id) => {
  const nameMap = {
    'bitcoin': 'Bitcoin',
    'ethereum': 'Ethereum',
    'binancecoin': 'BNB',
    'cardano': 'Cardano',
    'solana': 'Solana',
    'polkadot': 'Polkadot',
    'chainlink': 'Chainlink',
    'polygon': 'Polygon',
    'avalanche-2': 'Avalanche',
    'uniswap': 'Uniswap'
  };
  return nameMap[id] || id.charAt(0).toUpperCase() + id.slice(1);
};

// Helper function to get symbol abbreviations
const getSymbolAbbr = (id) => {
  const symbolMap = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'binancecoin': 'BNB',
    'cardano': 'ADA',
    'solana': 'SOL',
    'polkadot': 'DOT',
    'chainlink': 'LINK',
    'polygon': 'MATIC',
    'avalanche-2': 'AVAX',
    'uniswap': 'UNI'
  };
  return symbolMap[id] || id.toUpperCase().slice(0, 4);
};

// export const updateEpisode = catchAsync(async (req, res) => {
//   try {
//     const updated = await Episode.findByIdAndUpdate(req.params.id, req.body);
//     res.status(200).json({
//       message:
//         "Episode updated successfully",
//     });
//   } catch (err) {
//     console.log("Episode UPDATE ERROR ----> ", err);
//     res.status(400).json({
//       err: err.message,
//     });
//   }
// });


// export const getEpisode = catchAsync(async (req, res) => {
//   try {
//     const Episode = await Episode.findById(req.params.id);
//     res.status(200).json(Episode);
//   } catch (err) {
//     console.log("Episode FETCH ERROR ----> ", err);
//     res.status(400).json({
//       err: err.message,
//     });
//   }
// });

// export const getAllEpisodes = catchAsync(async (req, res) => {
//   try {
//     let Episodes = await Episode.find({})
//     res.status(200).json([...Episodes]);
//   } catch (err) {
//     console.log("Episode FETCH ERROR ----> ", err);
//     res.status(400).json({
//       err: err.message,
//     });
//   }
// });

// export const deleteEpisode = catchAsync(async (req, res) => {
//   try {
//     const deleted = await Episode.findByIdAndDelete(req.params.id)
  
//     if (!deleted) {
//       return next(new AppError('No document found with that ID', 404))
//     }
  
  
  
//     res.status(200).json({
//       status: 'success',
//       message:
//       "Episode deleted successfully",
//     })
//   } catch (err) {
//     console.log("Episode DELETE ERROR ----> ", err);
//     res.status(400).json({
//       err: err.message,
//     });
//   }
// });
