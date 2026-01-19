export interface Course {
    slug: string
    title: string
    description: string
    duration: string
    level: "Beginner" | "Intermediate" | "Advanced"
    lessons: number
    image: string
    content: CourseLesson[]
}

export interface CourseLesson {
    title: string
    content: string
}

export const courses: Course[] = [
    {
        slug: "staking-fundamentals",
        title: "Staking Fundamentals",
        description: "Everything you need to know to start staking cryptocurrency. Perfect for beginners looking to earn passive income.",
        duration: "45 min",
        level: "Beginner",
        lessons: 5,
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop",
        content: [
            {
                title: "What is Cryptocurrency Staking?",
                content: `Staking is one of the most popular ways to earn passive income in the cryptocurrency world. But what exactly is it?

**The Basics**
When you stake cryptocurrency, you're essentially locking up your coins to support the operations of a blockchain network. In return for your contribution, you earn rewards – typically in the form of additional cryptocurrency.

**How It Works**
Think of staking like a savings account for crypto. Just as a bank uses your deposited money to fund loans (and pays you interest), blockchain networks use your staked coins to validate transactions and secure the network.

**Key Benefits**
• **Passive Income**: Earn rewards without actively trading
• **Network Support**: Help secure and maintain blockchain networks
• **Lower Barriers**: No expensive mining equipment required
• **Environmental Impact**: More energy-efficient than mining

**Who Can Stake?**
Anyone with supported cryptocurrency can stake! You don't need technical knowledge or expensive equipment. Platforms like StakeBarn make it accessible to everyone.`
            },
            {
                title: "Understanding Proof of Stake",
                content: `Proof of Stake (PoS) is the consensus mechanism that makes staking possible. Let's break it down.

**What is Consensus?**
In blockchain, consensus is how the network agrees on which transactions are valid. Without a central authority, the network needs a system to prevent fraud.

**Proof of Stake vs Proof of Work**
• **Proof of Work (Bitcoin)**: Miners compete to solve complex puzzles using computing power
• **Proof of Stake (Ethereum 2.0)**: Validators are chosen based on their stake in the network

**How PoS Works**
1. Users stake their coins as collateral
2. The network randomly selects validators based on stake size
3. Validators verify transactions and create new blocks
4. Honest validators receive rewards; bad actors lose their stake

**Why PoS Matters**
PoS uses 99% less energy than PoW, making it more environmentally sustainable. It also allows ordinary users to participate in network security.`
            },
            {
                title: "Types of Staking",
                content: `Not all staking is created equal. Here are the main types you'll encounter.

**1. Flexible Staking**
• Withdraw your assets anytime
• Lower APY compared to locked staking
• Best for: Users who need liquidity

**2. Locked Staking**
• Assets locked for a fixed period (30, 60, 90+ days)
• Higher APY rewards
• Best for: Long-term holders

**3. Liquid Staking**
• Receive a token representing your staked assets
• Use that token in DeFi while still earning rewards
• Best for: Advanced users

**4. Delegated Staking**
• Delegate your stake to a validator
• They stake on your behalf
• Best for: Users who want simplicity

**Choosing the Right Type**
Consider your financial goals, liquidity needs, and risk tolerance when choosing a staking strategy.`
            },
            {
                title: "Understanding APY and Rewards",
                content: `APY is crucial to understanding your potential earnings. Let's demystify it.

**What is APY?**
APY stands for Annual Percentage Yield. It represents the total return on your staked assets over one year, including compound interest.

**APY vs APR**
• **APR**: Simple interest, doesn't account for compounding
• **APY**: Includes compound interest, shows true annual return

**What Affects APY?**
• **Network participation**: More stakers = lower individual rewards
• **Lock-up period**: Longer locks typically offer higher APY
• **Token inflation**: New tokens created as rewards
• **Platform fees**: Some platforms take a cut

**Realistic Expectations**
• ETH staking: 3-6% APY
• SOL staking: 6-8% APY
• Platform-enhanced staking: Can be higher

**The Power of Compounding**
If you reinvest your rewards, you'll earn interest on your interest. Over time, this significantly boosts returns.`
            },
            {
                title: "Getting Started with StakeBarn",
                content: `Ready to start staking? Here's your step-by-step guide.

**Step 1: Create Your Account**
Sign up at StakeBarn with your email. Enable two-factor authentication for security.

**Step 2: Deposit Cryptocurrency**
Transfer supported crypto (ETH, BTC, SOL, XRP) to your StakeBarn wallet. Follow the deposit instructions carefully.

**Step 3: Choose a Staking Plan**
Browse available plans and consider:
• APY offered
• Lock-up period (if any)
• Minimum stake required

**Step 4: Confirm Your Stake**
Review the terms, confirm your stake amount, and submit. Your stake will be active immediately.

**Step 5: Monitor & Earn**
Track your rewards in real-time through your dashboard. Rewards are credited daily.

**Pro Tips**
• Start small to understand the process
• Diversify across multiple cryptocurrencies
• Consider your liquidity needs before locking
• Compound rewards by restaking

Congratulations! You're now ready to start earning passive income through staking.`
            }
        ]
    },
    {
        slug: "bitcoin-explained",
        title: "Bitcoin & Mining Explained",
        description: "Understand how Bitcoin works, its Proof of Work consensus, and why it differs from stakeable cryptocurrencies.",
        duration: "35 min",
        level: "Beginner",
        lessons: 4,
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=1200&auto=format&fit=crop",
        content: [
            {
                title: "Introduction to Bitcoin",
                content: `Bitcoin is the first and most well-known cryptocurrency. Let's explore what makes it unique.

**The Origin**
Bitcoin was created in 2009 by the pseudonymous Satoshi Nakamoto. It was designed as a peer-to-peer electronic cash system with no central authority.

**Key Properties**
• **Decentralized**: No single entity controls Bitcoin
• **Limited Supply**: Only 21 million BTC will ever exist
• **Transparent**: All transactions are recorded on a public blockchain
• **Immutable**: Once confirmed, transactions cannot be reversed

**Why Bitcoin Matters**
Bitcoin pioneered blockchain technology and proved that digital scarcity is possible. It remains the largest cryptocurrency by market cap.

**Bitcoin as Digital Gold**
Many view Bitcoin as a store of value, similar to gold. Its fixed supply and decentralized nature make it resistant to inflation.`
            },
            {
                title: "How Bitcoin Mining Works",
                content: `Bitcoin uses Proof of Work (PoW) mining to secure its network.

**The Mining Process**
1. Miners collect pending transactions into a block
2. They race to solve a complex mathematical puzzle
3. The first miner to solve it broadcasts the solution
4. Other nodes verify and accept the block
5. The winning miner receives newly minted BTC

**Why Mining Requires Energy**
The puzzle-solving process requires massive computational power. This energy expenditure is what secures the network against attacks.

**Mining Rewards**
• Block reward: Currently 3.125 BTC per block
• Halving: Reward cuts in half every 4 years
• Transaction fees: Miners also earn fees from transactions

**Mining Hardware**
• **CPUs**: Obsolete for Bitcoin mining
• **GPUs**: No longer competitive
• **ASICs**: Specialized chips designed only for mining

Bitcoin cannot be staked because it uses PoW, not PoS.`
            },
            {
                title: "Bitcoin vs Ethereum: Key Differences",
                content: `Bitcoin and Ethereum are both major cryptocurrencies, but they serve different purposes.

**Purpose**
• **Bitcoin**: Digital money, store of value
• **Ethereum**: Smart contract platform, programmable blockchain

**Consensus Mechanism**
• **Bitcoin**: Proof of Work (mining)
• **Ethereum**: Proof of Stake (staking) since 2022

**Supply**
• **Bitcoin**: Fixed at 21 million
• **Ethereum**: No fixed cap (but net deflationary post-merge)

**Transaction Speed**
• **Bitcoin**: ~7 transactions per second
• **Ethereum**: ~15-30 transactions per second

**Smart Contracts**
• **Bitcoin**: Limited scripting capability
• **Ethereum**: Full smart contract functionality

**Environmental Impact**
• **Bitcoin**: High energy consumption (PoW)
• **Ethereum**: 99% reduction after PoS transition

Both have their place in a diversified crypto portfolio.`
            },
            {
                title: "Can You Stake Bitcoin?",
                content: `A common question: Can Bitcoin be staked like Ethereum?

**Short Answer**: Traditional staking, no. But there are alternatives.

**Why Bitcoin Can't Be Natively Staked**
Bitcoin uses Proof of Work, not Proof of Stake. There's no native staking mechanism in the Bitcoin protocol.

**Alternative Ways to Earn on Bitcoin**

**1. Wrapped Bitcoin (WBTC)**
• BTC wrapped as an ERC-20 token
• Can be used in Ethereum DeFi
• Earn yield through lending/staking

**2. Bitcoin Lending Platforms**
• Lend your BTC to borrowers
• Earn interest on your holdings
• Counter-party risk exists

**3. Layer 2 Solutions**
• Lightning Network for payments
• Bitcoin sidechains with staking features

**4. Staking Platforms**
Platforms like StakeBarn offer BTC staking by pooling assets and generating returns through various DeFi strategies.

**Risk Considerations**
Always understand the mechanism generating your yield. Higher returns often mean higher risks.`
            }
        ]
    },
    {
        slug: "ethereum-staking-deep-dive",
        title: "Ethereum Staking Deep Dive",
        description: "Master Ethereum staking post-Merge. Learn about validators, rewards, and how to maximize your ETH staking returns.",
        duration: "50 min",
        level: "Intermediate",
        lessons: 5,
        image: "https://images.unsplash.com/photo-1622790698141-94e30457ef12?q=80&w=1200&auto=format&fit=crop",
        content: [
            {
                title: "The Ethereum Merge Explained",
                content: `In September 2022, Ethereum underwent its most significant upgrade: The Merge.

**What Was The Merge?**
Ethereum transitioned from Proof of Work to Proof of Stake. This change:
• Reduced energy consumption by 99.95%
• Enabled native ETH staking
• Changed how new blocks are created

**Before vs After**
• **Before**: Miners competed using computing power
• **After**: Validators stake 32 ETH to participate

**Why It Matters for Stakers**
The Merge made ETH one of the most attractive staking assets. You can now earn rewards by helping secure the network.

**Current State**
Millions of ETH are now staked, and the network is more decentralized than ever. Anyone can participate through staking pools or personal validators.`
            },
            {
                title: "Running an Ethereum Validator",
                content: `Want to run your own validator? Here's what you need to know.

**Requirements**
• **32 ETH**: Minimum stake required
• **Hardware**: Dedicated computer, 24/7 uptime
• **Software**: Execution client + consensus client
• **Technical knowledge**: Command line familiarity

**Responsibilities**
• Propose new blocks when selected
• Attest to other validators' blocks
• Stay online as much as possible

**Rewards**
• Attestation rewards: Small, consistent payments
• Block proposals: Larger, less frequent rewards
• Priority fees: Tips from transactions

**Slashing Risks**
Validators can lose ETH if they:
• Sign conflicting blocks
• Make incorrect attestations
• Stay offline for extended periods

**Is It Worth It?**
For most users, pooled staking is easier and more practical than running a personal validator.`
            },
            {
                title: "Pooled vs Solo Staking",
                content: `Not everyone has 32 ETH. Let's compare your options.

**Solo Staking**
Pros:
• Keep all rewards
• Full control
• Maximum decentralization support

Cons:
• 32 ETH minimum
• Technical complexity
• Hardware requirements
• Slashing risk

**Pooled Staking**
Pros:
• Stake any amount
• No technical knowledge needed
• Managed by professionals
• Instant liquidity (some platforms)

Cons:
• Fees reduce returns
• Trust in the platform
• Less decentralization

**Which Is Right for You?**
• **Small holders**: Pooled staking
• **Tech-savvy with 32+ ETH**: Consider solo
• **Most users**: Pooled through platforms like StakeBarn

The goal is accumulating rewards, not complexity for its own sake.`
            },
            {
                title: "Liquid Staking Tokens",
                content: `Liquid staking is revolutionizing how we think about staked assets.

**The Problem with Traditional Staking**
Your ETH is locked. You can't use it for other purposes while earning rewards.

**The Solution: Liquid Staking**
1. Deposit ETH with a liquid staking provider
2. Receive a derivative token (like stETH)
3. Use that token elsewhere while still earning rewards

**Popular Liquid Staking Tokens**
• **stETH (Lido)**: Most widely used
• **rETH (Rocket Pool)**: More decentralized
• **cbETH (Coinbase)**: Exchange-backed

**Use Cases**
• Collateral for loans
• Yield farming in DeFi
• Trading while still staked

**Risks**
• Smart contract vulnerabilities
• Depeg from ETH value
• Platform-specific risks

Liquid staking offers flexibility but adds complexity and risk.`
            },
            {
                title: "Maximizing ETH Staking Returns",
                content: `Here are strategies to optimize your Ethereum staking.

**1. Choose the Right Platform**
Compare:
• APY rates
• Fees
• Track record
• Liquidity options

**2. Consider Lock-up Periods**
Longer locks often mean higher yields. Match your commitment to your liquidity needs.

**3. Compound Your Rewards**
Regularly restake your earnings to benefit from compound growth.

**4. Diversify Strategies**
Don't put all your ETH in one place. Spread across:
• Different platforms
• Different staking types
• Other cryptocurrencies

**5. Stay Informed**
Ethereum development moves fast. Protocol upgrades can affect yields.

**6. Tax Planning**
Staking rewards may be taxable. Track everything and consult a tax professional.

**7. Monitor Performance**
Check your rewards regularly. If a platform underperforms, consider moving.

With the right approach, ETH staking can be a reliable source of passive income.`
            }
        ]
    },
    {
        slug: "risk-management",
        title: "Risk Management in Crypto",
        description: "Learn to protect your investments with proven risk management strategies for cryptocurrency staking.",
        duration: "40 min",
        level: "Intermediate",
        lessons: 4,
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
        content: [
            {
                title: "Understanding Crypto Risks",
                content: `Before staking, understand the risks involved.

**Market Risk**
• Crypto prices are highly volatile
• Your staked assets can lose value even while earning rewards
• A 10% APY means nothing if the token drops 50%

**Platform Risk**
• Exchanges and platforms can be hacked
• Companies can become insolvent
• Smart contracts may have vulnerabilities

**Slashing Risk**
• In PoS, validators can lose stake for misbehavior
• Even delegators can be affected
• Different protocols have different rules

**Regulatory Risk**
• Governments may restrict crypto activities
• Tax laws can change
• Some platforms may block users from certain regions

**Opportunity Cost**
• Locked assets can't be traded
• You might miss better opportunities
• Liquidity has value

Understanding risks is the first step to managing them.`
            },
            {
                title: "Diversification Strategies",
                content: `Don't put all your eggs in one basket.

**Diversify Across Cryptocurrencies**
• ETH, BTC, SOL, XRP each have different risk profiles
• Some perform better in different market conditions
• Spread your stake across multiple assets

**Diversify Across Platforms**
• Use 2-3 trusted staking platforms
• Review each platform's security measures
• Check their insurance and fund recovery policies

**Diversify Staking Types**
• Some flexible for liquidity
• Some locked for higher yields
• Balance based on your needs

**Diversify Lock-up Periods**
• Short, medium, and long-term stakes
• Ensures regular access to some funds
• Reduces timing risk

**The 3-Bucket Strategy**
1. **Emergency**: Flexible staking (20-30%)
2. **Growth**: Medium-term locked (40-50%)
3. **Long-term**: Extended lock for max APY (20-30%)

Diversification doesn't eliminate risk, but it manages it.`
            },
            {
                title: "Security Best Practices",
                content: `Protect your crypto with these essential practices.

**Account Security**
• Use unique, strong passwords
• Enable 2FA (preferably hardware key)
• Never share your credentials
• Be suspicious of phishing attempts

**Wallet Security**
• Use hardware wallets for large holdings
• Keep seed phrases offline
• Never enter seed phrases on websites
• Verify addresses before sending

**Platform Due Diligence**
• Research the team behind the platform
• Check for security audits
• Review their track record
• Look for insurance or funds protection

**Operational Security**
• Use a dedicated device for crypto
• Keep software updated
• Use VPN on public networks
• Be careful what you share publicly

**Red Flags to Watch**
• Promises of unrealistic returns
• Pressure to act quickly
• Requests for private keys
• Unprofessional communications

Security is not optional. One mistake can cost everything.`
            },
            {
                title: "Building a Staking Plan",
                content: `Create a structured approach to staking.

**Step 1: Define Your Goals**
• What's your target return?
• What's your time horizon?
• How much risk can you tolerate?

**Step 2: Determine Your Budget**
• Only invest what you can afford to lose
• Keep emergency funds in fiat
• Start small and increase gradually

**Step 3: Choose Your Assets**
• Research each cryptocurrency's fundamentals
• Consider staking yields AND price potential
• Diversify appropriately

**Step 4: Select Platforms**
• Compare StakeBarn with others
• Check fees, security, and reputation
• Test with small amounts first

**Step 5: Set Up Monitoring**
• Track your positions
• Monitor APY changes
• Stay informed about market conditions

**Step 6: Review Regularly**
• Monthly: Check performance
• Quarterly: Rebalance if needed
• Annually: Reassess strategy

**Sample Staking Portfolio**
• 40% ETH (various lock periods)
• 25% BTC (for stability)
• 20% SOL (higher yield potential)
• 15% XRP (diversification)

A plan removes emotion from decisions and improves outcomes.`
            }
        ]
    },
    {
        slug: "advanced-strategies",
        title: "Advanced Staking Strategies",
        description: "Take your staking to the next level with advanced techniques for maximizing returns and optimizing your portfolio.",
        duration: "55 min",
        level: "Advanced",
        lessons: 5,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
        content: [
            {
                title: "Yield Optimization Techniques",
                content: `Go beyond basic staking to maximize your returns.

**Compound Staking**
• Regularly reinvest rewards
• Monthly compounding vs annual makes a real difference
• Automate where possible

**APY Hunting**
• Monitor rates across platforms
• Move to higher yields when beneficial
• Factor in fees and lock-up periods

**Timing Strategies**
• Lock tokens when rates are high
• Use flexible staking during uncertainty
• Build a ladder of lock-up periods

**Dollar-Cost Averaging Stakes**
• Stake regularly rather than all at once
• Smooths out entry price
• Reduces timing risk

**Portfolio Rebalancing**
• Quarterly review allocations
• Sell outperformers, buy underperformers
• Maintain target ratios

**Yield Stacking**
• Combine staking with other yield sources
• Use liquid staking tokens in DeFi
• Layer multiple yield strategies

Advanced strategies require more attention but can significantly boost returns.`
            },
            {
                title: "DeFi Integration",
                content: `Combine staking with decentralized finance.

**Liquid Staking + DeFi**
1. Stake ETH, receive stETH
2. Deposit stETH as collateral in Aave
3. Borrow stablecoins
4. Stake those stablecoins elsewhere
5. Earn multiple yields simultaneously

**Yield Farming**
• Provide liquidity to DEXs
• Earn trading fees + farming rewards
• Higher risk, higher potential return

**Leveraged Staking**
• Borrow against staked assets
• Stake the borrowed funds
• Amplified risk and reward

**Protocol Incentives**
• Many DeFi protocols offer extra rewards
• Airdrops to active users
• Governance token distributions

**Risks of DeFi Integration**
• Smart contract vulnerabilities
• Impermanent loss
• Liquidation risk
• Protocol complexity

Only pursue DeFi strategies if you understand the risks involved.`
            },
            {
                title: "Tax Optimization",
                content: `Minimize your tax burden legally.

**Understanding Crypto Taxes**
• Staking rewards are typically income
• Selling rewards triggers capital gains
• Rules vary by jurisdiction

**Tax-Efficient Strategies**

**1. Hold for Long-Term Gains**
• Long-term rates often lower than short-term
• Plan your holding periods

**2. Harvest Losses**
• Sell losing positions to offset gains
• Repurchase after waiting period (check local rules)

**3. Use Tax-Advantaged Accounts**
• Some jurisdictions allow crypto in retirement accounts
• Check eligibility and regulations

**4. Track Everything**
• Use crypto tax software
• Document every transaction
• Save records for 7+ years

**5. Time Withdrawals**
• Spread realizations across tax years
• Consider income levels and brackets

**6. Gift Strategically**
• Gifts may have tax advantages
• Charity donations can be deductible

**Professional Advice**
Tax laws are complex. Consult a crypto-savvy accountant for your situation.`
            },
            {
                title: "Cross-Chain Staking",
                content: `Expand your staking across multiple blockchains.

**Why Cross-Chain?**
• Different chains offer different opportunities
• Reduces dependency on any single ecosystem
• Access to unique yield opportunities

**Popular Staking Chains**
• **Ethereum**: Largest ecosystem, solid yields
• **Solana**: Fast, low fees, high APY potential
• **Cosmos**: IBC enables easy cross-chain activity
• **Polkadot**: Parachain ecosystem staking
• **Avalanche**: High-performance, multiple subnets

**Cross-Chain Tools**
• **Bridges**: Move assets between chains
• **Multi-chain wallets**: Manage all in one place
• **Aggregators**: Find best yields across chains

**Challenges**
• Bridge security risks
• Different wallet requirements
• Varying gas costs
• Complexity management

**Best Practices**
• Start with 2-3 chains
• Use well-established bridges
• Keep thorough records
• Understand each chain's mechanics

Cross-chain diversification adds complexity but can enhance returns and reduce risk.`
            },
            {
                title: "Building Passive Income",
                content: `Create a sustainable crypto income stream.

**The Passive Income Goal**
Many stakers aim to eventually live off staking rewards. Here's how to work toward that.

**Calculate Your Number**
• Monthly expenses × 12 = Annual needs
• Annual needs ÷ Average APY = Required capital
• Example: $3,000/month × 12 = $36,000 ÷ 0.10 = $360,000

**Building Your Stack**
• Regular contributions
• Reinvest all rewards
• Focus on accumulation phase first

**Income Phase Strategy**
Once capital is sufficient:
• Keep core stake growing
• Withdraw only excess rewards
• Maintain emergency fund

**Sustainability Considerations**
• APY can decrease over time
• Token values fluctuate
• Build in safety margin

**The 4% Rule for Crypto**
• Traditional finance suggests 4% annual withdrawal
• For crypto, consider 2-3% due to volatility
• Adjust based on market conditions

**Reality Check**
Building significant passive income takes time. Focus on consistent growth rather than get-rich-quick schemes.

**The Journey**
Year 1-3: Accumulate and learn
Year 3-5: Optimize and grow
Year 5+: Generate sustainable income

Patience and discipline are your greatest assets.`
            }
        ]
    }
]

export function getCourse(slug: string): Course | undefined {
    return courses.find((course) => course.slug === slug)
}

export function getAllCourses(): Course[] {
    return courses
}
