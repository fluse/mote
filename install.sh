#!/bin/sh

read -p "which os? (linux/mac)" CONT
if [ "$CONT" == "linux" ]; then
    echo "Linux Install"
    if hash wget > 2>/dev/null; then
        sudo apt-get install wget
    fi

    if hash fontforge > 2>/dev/null; then
        sudo apt-get install fontforge
    fi

    if hash ttfautohint > 2>/dev/null; then
        sudo apt-get install ttfautohint
    fi

    if hash ruby > 2>/dev/null; then
        sudo apt-get install ruby
    fi

    if hash gem > 2>/dev/null; then
        sudo apt-get install rubygems
    fi

else
    echo "Mac Install"
    ### install brew with curl
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ### brew install wget and node
    brew install wget
    brew install node
    brew install ttfautohint fontforge --with-python
fi

### install sass

sudo gem install sass
sudo gem install sass-json-vars

### node package manager
npm install bower -g
npm install grunt-cli -g

### install package.json dependencies
npm install

### create theme css with theme directory

read -p "The Name of your theme?" CONT

grunt mote
grunt theme -name='$CONT'
grunt compile