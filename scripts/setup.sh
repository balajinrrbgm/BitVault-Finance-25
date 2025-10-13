#!/bin/bash

# BitVault Finance Setup Script
echo "🛠 Setting up BitVault Finance development environment..."

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v scarb &> /dev/null; then
    echo "❌ Scarb not found. Please install Scarb first."
    exit 1
fi

if ! command -v starkli &> /dev/null; then
    echo "❌ Starkli not found. Please install Starkli first."
    exit 1
fi

echo "✅ Prerequisites satisfied"

# Install dependencies
echo "📦 Installing dependencies..."
scarb build

# Run tests
echo "🧪 Running tests..."
snforge test

echo "✅ Setup completed successfully!"
echo "Run 'scarb build' to build contracts"
echo "Run 'snforge test' to run tests"
