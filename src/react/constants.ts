import { StepKey } from './types';
import edenImage from '../assets/images/eden.svg';
import flashbotsImage from '../assets/images/flashbots.svg';
import manifoldImage from '../assets/images/manifold.svg';
import ultraImage from '../assets/images/ultra.svg';
import bloxImage from '../assets/images/bloxroute.svg';
import gnosisImage from '../assets/images/gnosis.svg';
import aestusImage from '../assets/images/aestus.svg';

export const MNEMONIC_ERROR_SEARCH = "That is not a valid mnemonic";
export const VALID_MNEMONIC_LENGTHS = [12, 15, 18, 21, 24];
export const ETH_TO_GWEI = 10 ** 9;

export const errors = {
	MNEMONIC_LENGTH_ERROR: `The Secret Recovery Phrase must be ${VALID_MNEMONIC_LENGTHS.slice(0, -1).join(", ")}, or ${VALID_MNEMONIC_LENGTHS.slice(-1)} words in length. Please verify each word and try again.`,
	INVALID_MNEMONIC_ERROR: "The Secret Recovery Phrase provided is invalid. Please double check each word for any spelling errors.",
	MNEMONICS_DONT_MATCH: "The Secret Recovery Phrase you entered does not match what was given to you. Please try again.",
	NUMBER_OF_KEYS: "Please input a number between 1 and 1000.",
  DEPOSIT_AMOUNT: "Amount must be between 32 and 2048.",
	ADDRESS_FORMAT_ERROR: "Please enter a valid Ethereum address.",
	WITHDRAW_ADDRESS_REQUIRED: "Please enter an Ethereum address.",
	PASSWORD_STRENGTH: "Password must be at least 12 characters.",
	ADDRESS_STRENGTH: "Please enter an Ethereum address.",
	PASSWORD_MATCH: "Passwords don't match.",
	STARTING_INDEX: "Please input start index.",
	NON_NEGATIVE_INDEX: "Start index can not be a negative number",
	INDICES: "Please input indices.",
	INDICES_FORMAT: "Please input indices with digits only.",
	INDICES_LENGTH: "The amount of indices must match the amount of BLS credentials",
	BLS_CREDENTIALS: "Please input BLS credentials.",
	BLS_CREDENTIALS_FORMAT: "Please enter valid BLS credentials.",
	BLS_CREDENTIALS_NO_MATCH: "Those BLS credentials do not match those we can derive from your Secret Recovery Phrase.",
	FOLDER: "Please select a folder.",
	FOLDER_DOES_NOT_EXISTS: "Folder does not exist. Select an existing folder.",
	FOLDER_IS_NOT_WRITABLE: "Cannot write in this folder. Select a folder in which you have write permission.",
	UNEXPECTED_ERROR: "An unexpected error occurred. Please try again later.",
	SIMPLE_NETWORK_ERROR: "Failed to fetch",
	NETWORK_ERROR: "Network error: Please check your internet connection.",
};

export const tooltips = {
	IMPORT_MNEMONIC: "If you've already created a Secret Recovery Phrase, you can use it to regenerate your original keys, create more keys, or generate a BLS to execution change by importing the phrase here.",
	NUMBER_OF_KEYS: "Enter how many new validator keys you'd like to create.",
  AMOUNT: "Enter the amount you would like to deposit for each validator. This value must be between 32 and 2048 and can not have greater precision than 1 gwei. You must have withdrawal credentials defined.",
	PASSWORD: "Pick a strong password (at least 12 characters) that will be used to protect your keys.",
	STARTING_INDEX: "Each key is created sequentially, so we need to know how many you've created with this Secret Recovery Phrase in the past in order to create some new ones for you.",
	ETH1_WITHDRAW_ADDRESS: "An required Ethereum address for the withdrawal credentials.",
	BTEC_WITHDRAW_ADDRESS: "An Ethereum address for withdrawal. There is where your validator balance and rewards will go.",
	OFFLINE: "You want to avoid exposing your Secret Recovery Phrase to any system that can send it online and compromise your security. Booting from a live OS that does not connect to any network on a USB drive is an easy way to achieve that. You can copy the resulting files on USB drives. You might want to avoid storing your Secret Recovery Phrase electronically.",
	SYNC_AND_OFFLINE: "You must have network access to sync the operators, but you should be offline when creating the keys.You want to avoid exposing your Secret Recovery Phrase to any system that can send it online and compromise your security. Booting from a live OS that does not connect to any network on a USB drive is an easy way to achieve that. You can copy the resulting files on USB drives. You might want to avoid storing your Secret Recovery Phrase electronically.",
	BTEC_START_INDEX: "The index position for the keys to start generating withdrawal credentials. If you only created 1 validator key using this Secret Recovery Phrase, this is likely going to be 0. If you created many validator keys, this could be a higher value from where you want to start in the list of validators derived from your Secret Recovery Phrase.",
	BTEC_INDICES: "A list of the chosen validator index number(s) as identified on the beacon chain. You can find your validator indice on beaconcha.in website on your validator page. It will be at the top of that page the form of a title like Validator XXXXX, where XXXXX is going to be your indice.",
	BLS_CREDENTIALS: "A list of the old BLS withdrawal credentials of the given validator(s). You can find your validator BLS withdrawal credentials on beaconcha.in website on your validator page. It will be in the Deposits tab and it should start with 0x00.",
  COMPOUNDING: "Compounding Credentials increases your maximum effective balance from 32 to 2048 ETH."
};

export const stepLabels = {
	[StepKey.MnemonicImport]: 'Import Secret Recovery Phrase',
	[StepKey.MnemonicGeneration]: 'Create Secret Recovery Phrase',
	[StepKey.KeyConfiguration]: 'Configure Validator Keys',
	[StepKey.SlitKeyStore]: 'Select Operator',
	[StepKey.KeyGeneration]: 'Create Validator Key Files',
	[StepKey.Finish]: 'Finish',
	[StepKey.BTECConfiguration]: 'Configure Withdrawal Address',
  [StepKey.BTECGeneration]: 'Create Credentials Change',
  [StepKey.FinishBTEC]: 'Finish'
};

export const CreateMnemonicFlow = [StepKey.MnemonicGeneration, StepKey.KeyConfiguration, StepKey.SlitKeyStore, StepKey.KeyGeneration, StepKey.Finish];
export const ExistingMnemonicFlow = [StepKey.MnemonicImport, StepKey.KeyConfiguration, StepKey.SlitKeyStore, StepKey.KeyGeneration, StepKey.Finish];
export const BTECFlow = [StepKey.MnemonicImport, StepKey.BTECConfiguration, StepKey.BTECGeneration, StepKey.FinishBTEC];

export const paths = {
	CREATE_MNEMONIC: "/create",
	CONFIGURE_CREATE: "/configure-create",
	CREATE_KEYS_CREATE: "/create-keys",
	FINISH_CREATE:"/finish-create",

	EXISTING_IMPORT: "/import-existing",
	CONFIGURE_EXISTING: "/configure-existing",
	CREATE_KEYS_EXISTING: "/create-existing-keys",
	FINISH_EXISTING: "/finish-existing",

	BTEC_IMPORT: "/import-btec",
	CONFIGURE_BTEC: "/configure-btec",
	CREATE_CREDENTIALS: "/create-btec",
	FINISH_CREDENTIALS: "/finish-btec",

	CHOOSE_OPERATOR_EXISTING: '/choose-operator-existing',
  CHOOSE_OPERATOR: '/choose-operator-create',
};

export const DEFAULT_CLUSTER_SIZE = 4;
export const FILTER_OPTION = [
	"Verified",
	"DKG Enabled",
]
export const VERIFIED = "Verified";
export const DKG_ENABLED = "DKG Enabled";

export const RELAYER_IMAGE_MAP: { [key: string]: string } = {
	'Eden Network': edenImage,
	'Flashbots': flashbotsImage,
	'Manifold': manifoldImage,
	'Ultra Sound': ultraImage,
	'bloXroute Max Profit': bloxImage,
	'bloXroute Regulated': bloxImage,
	'Agnostic Gnosis': gnosisImage,
	'Aestus': aestusImage,
}

export const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour
export const EXPIRATION_CHECK_TIME = 60 * 1000; // 1 minute

export const INTERVAL_TIME = 800 // 800ms

export const SSV_EXCHANGE = 382640000000

export const VERIFIED_OPERATOR = 'verified_operator';