import 'dotenv/config';
import ethers from 'ethers';
import fs from 'fs-extra';

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC);

  const wallet = new ethers.Wallet(process.env.PK_WALLET, provider);

  const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf8');
  const binary = fs.readFileSync(
    './SimpleStorage_sol_SimpleStorage.bin',
    'utf8'
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  const contract = await contractFactory.deploy();
  console.log('Contract Address', contract.address);
  await contract.deployTransaction.wait(1);

  const favNum = await contract.retrieve();
  console.log('favNum', favNum.toString());

  const trxResponse = await contract.store('10');
  await trxResponse.wait(1);

  const updFavNum = await contract.retrieve();
  console.log('updFavNum', updFavNum.toString());
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
