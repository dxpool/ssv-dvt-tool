# DxPool Key Gen
DxPool Key Gen is a GUI application providing functionality to the [ethstaker-deposit-cli. ](https://github.com/eth-educators/ethstaker-deposit-cli). It is a React app running in Electron.  See `src/electron/` for the simple electron app and `src/react/` for where the magic happens.

## Environment Configuration & Dependencies
Prior to running Dxpool Key Gen a few dependencies need to be installed. 

### Ubuntu 20.04 and later
Execute all those commands in your terminal to setup your dev environment.

```console
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

sudo apt install -y build-essential nodejs git python3-distutils python3-dev

PATH="$HOME/.local/bin:$PATH"

curl -sSL https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py
pip3 install pyinstaller

sudo npm install -g yarn

git clone https://github.com/dxpool/ssv-dvt-tool.git
cd key-gen

yarn install
yarn buildcli
```

### Ubuntu 18.04
Even if Ubuntu 18.04 is somewhat old, it is a great OS to build our releases on for the Linux target because it has an older GLIBC which makes it more compatible. More details [here](https://pyinstaller.readthedocs.io/en/stable/usage.html#making-gnu-linux-apps-forward-compatible).

Execute all those commands in your terminal to build a distribution for release.
```console
sudo apt update && sudo apt -y upgrade

sudo add-apt-repository -y ppa:deadsnakes/ppa
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

sudo apt install -y python3.10-dev python3.10-distutils zlib1g-dev build-essential nodejs git

PATH="$HOME/.local/bin:$PATH"

curl -sSL https://bootstrap.pypa.io/get-pip.py -o get-pip.py
alias python3=python3.10
echo -e "\nalias python3=python3.10" >> ~/.bash_aliases
python3 get-pip.py
pip3 install pyinstaller

sudo corepack enable

git clone https://github.com/dxpool/ssv-dvt-tool.git
cd key-gen

yarn install
yarn build
yarn buildcli
yarn dist
```

### Windows 10
- Download and install Node.js and npm from https://nodejs.org/en/download/ (Use LTS version and 64-bit .msi Installer).
  - At the screen named *Tools for Native Modules*, make sure to check the option named *Automatically install the necessary tools.*. It will install chocolatey, Python 3 and VS build tools. Follow the instructions until the end.
- Open a command prompt window as admin (Press `⊞ Win`+`R`, type `cmd`, hold `Ctrl` + `Shift` and press `↵ Enter`)
  -  Execute this command to install git. Follow the instructions on screen.
```console
choco install git.install
```
- Open a normal command prompt window (Press `⊞ Win`+`R`, type `cmd` and press `↵ Enter`).
  - Execute those commands to upgrade pip, install pyinstaller, Cython, install yarn, clone the repository and install the required packages.
```console
python -m pip install --upgrade --user pip
python -m pip install --user pyinstaller
python -m pip install --user Cython
set PATH=%APPDATA%\python\Python310\Scripts;%PATH%

npm install -g yarn

git clone https://github.com/dxpool/ssv-dvt-tool.git
cd key-gen

yarn install
yarn buildcliwin
```

### macOS 10.15.1 and later
Execute all those commands in your terminal to setup your dev environment.  You may be prompted to install "command line developer tools" at some point and please do it.

```console
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/$USER/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

git --version

// If git is not found, run the following
brew install git

python3 --version
pip3 --version

// If either python3 or pip3 are not found, run the following
brew install python3

brew install node
pip3 install pyinstaller
npm install -g yarn

git clone https://github.com/dxpool/ssv-dvt-tool.git
cd key-gen

yarn install
yarn buildcli
```

## Start DxPool Key Gen
Run the following commands in the repository directory:

 - `yarn build`
   - `yarn build:watch` (will reload build on changes)
   - _In order to get them to show in the app press `ctrl+r` or `cmd+r` once the app is started._
 - `yarn start`

## To run diagnostics
To open dev tools when in DxPool Key Gen use `Ctrl` + `Shift` + `I`

## Bundling
We use [electron-builder](https://www.electron.build/) to create executable bundles for Dxpool Key Gen.  Run the following to create a bundle:
 - `yarn run build`
 - `yarn run buildcli` (or `yarn run buildcliwin` on Windows)
 - `yarn run dist`

Your assets will be in the `dist/` folder.

## License
[GPL](LICENSE)
