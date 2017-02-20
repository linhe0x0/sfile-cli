# sfile-cli

A better command line utility for https://staticfile.org/.

## Installation

Using [npm](https://www.npmjs.com/):

```
$ npm install -g sfile-cli
```

If you are using Mac, maybe you need to run this with `sudo`:

```
$ sudo npm install -g sfile-cli
```

## Usage

```
➜ sfile --help


  Usage:  [options] [command] <keyword>


  Commands:

    search <keyword>  search packages with keyword.
    get <pkg>         get specific package with package name.
    info <pkg>        get specific package info with package name.

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -s, --ssl      output HTTPS link

  Examples:

    $ sfile react
    $ sfile search react
    $ sfile get react
    $ sfile get react@15.4.0
    $ sfile get -s react
    $ sfile info react

```
