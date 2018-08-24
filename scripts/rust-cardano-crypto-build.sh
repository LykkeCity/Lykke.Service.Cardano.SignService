#! /bin/bash

git submodule update --init --recursive && \
RUST_TOOLCHAIN="$(cat lib/rust-cardano-crypto/rust-toolchain)" && \
curl https://sh.rustup.rs -sSf | sh -s -- -y && \
source $HOME/.cargo/env && \
rustup install ${RUST_TOOLCHAIN} && \
rustup target add wasm32-unknown-unknown --toolchain ${RUST_TOOLCHAIN} && \
cd lib/rust-cardano-crypto && \
npm install && \
./build && \
cd ../.. && \
npm install lib/rust-cardano-crypto